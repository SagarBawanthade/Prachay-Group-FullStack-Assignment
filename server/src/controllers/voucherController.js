import { Voucher } from '../models/Voucher.js';
import { uploadSignature, getPresignedSignatureUrl } from '../services/storageService.js';

// Helper to generate unique sequential / timestamp voucher numbers like EV-2026-0001
const generateVoucherNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Voucher.countDocuments();
  const sequence = String(count + 1).padStart(4, '0');
  const randomSuffix = Math.floor(100 + Math.random() * 900); // Prevent collision
  return `EV-${year}-${sequence}${randomSuffix}`;
};

// Helper to attach presigned URLs to voucher response
const attachPresignedUrls = async (voucher, req) => {
  const protocol = req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;

  const voucherObj = voucher.toObject ? voucher.toObject() : { ...voucher };

  if (voucherObj.employeeSignatureKey) {
    voucherObj.employeeSignatureUrl = await getPresignedSignatureUrl(
      voucherObj.employeeSignatureKey,
      baseUrl
    );
  }
  if (voucherObj.directorSignatureKey) {
    voucherObj.directorSignatureUrl = await getPresignedSignatureUrl(
      voucherObj.directorSignatureKey,
      baseUrl
    );
  }

  return voucherObj;
};

/**
 * @desc Get vouchers with search, filter, sort, and pagination
 * @route GET /api/vouchers
 */
export const getVouchers = async (req, res) => {
  try {
    const {
      search,
      status,
      department,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Role-based visibility isolation: Employees can ONLY view their own vouchers
    if (req.user.role === 'Employee') {
      query.employee = req.user._id;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Department filter
    if (department && department !== 'All') {
      query.department = department;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    // Date range filter (by expenseDate or voucherDate)
    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) query.expenseDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.expenseDate.$lte = end;
      }
    }

    // General text search across voucherNumber, employeeName, title, description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { voucherNumber: searchRegex },
        { employeeName: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { department: searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const totalVouchers = await Voucher.countDocuments(query);
    const rawVouchers = await Voucher.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Attach short-lived presigned URLs for private signatures
    const vouchers = await Promise.all(
      rawVouchers.map((v) => attachPresignedUrls(v, req))
    );

    return res.status(200).json({
      success: true,
      data: vouchers,
      pagination: {
        total: totalVouchers,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalVouchers / limitNum) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vouchers',
      error: error.message,
    });
  }
};

/**
 * @desc Get single voucher by ID
 * @route GET /api/vouchers/:id
 */
export const getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    // Role check: Employee can only view their own
    if (req.user.role === 'Employee' && voucher.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You do not have permission to view another employee voucher.',
      });
    }

    const populatedVoucher = await attachPresignedUrls(voucher, req);

    return res.status(200).json({
      success: true,
      data: populatedVoucher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch voucher details',
      error: error.message,
    });
  }
};

/**
 * @desc Create voucher (Draft or direct Submit)
 * @route POST /api/vouchers
 */
export const createVoucher = async (req, res) => {
  try {
    const {
      expenseDate,
      department,
      title,
      category,
      description,
      amount,
      action = 'draft', // 'draft' or 'submit'
    } = req.body;

    // Validation rules
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: 'Department is mandatory.' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Expense title is mandatory.' });
    }
    if (!expenseDate) {
      return res.status(400).json({ success: false, message: 'Expense date is mandatory.' });
    }
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Amount is mandatory and must be greater than zero.' });
    }

    let employeeSignatureKey = null;
    if (req.file) {
      employeeSignatureKey = await uploadSignature(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    // Business rule: employee signature is mandatory before submission
    if (action === 'submit' && !employeeSignatureKey) {
      return res.status(400).json({
        success: false,
        message: 'Employee signature image is mandatory when submitting for approval.',
      });
    }

    const voucherNumber = await generateVoucherNumber();

    const newVoucher = await Voucher.create({
      voucherNumber,
      voucherDate: new Date(),
      expenseDate: new Date(expenseDate),
      department: department.trim(),
      title: title.trim(),
      category: category || 'Other',
      description: description ? description.trim() : '',
      amount: Number(amount),
      status: action === 'submit' ? 'Submitted' : 'Draft',
      employee: req.user._id,
      employeeName: req.user.name,
      employeeId: req.user.employeeId || '',
      employeeSignatureKey,
    });

    const populatedVoucher = await attachPresignedUrls(newVoucher, req);

    return res.status(201).json({
      success: true,
      message: action === 'submit' ? 'Voucher submitted successfully for approval.' : 'Draft voucher saved successfully.',
      data: populatedVoucher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create voucher',
      error: error.message,
    });
  }
};

/**
 * @desc Update draft voucher
 * @route PUT /api/vouchers/:id
 */
export const updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    // Ownership check
    if (voucher.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own vouchers.',
      });
    }

    // Business rule: Can only edit while in Draft status
    if (voucher.status !== 'Draft') {
      return res.status(400).json({
        success: false,
        message: `Voucher cannot be edited because it is in '${voucher.status}' status. Only Draft vouchers can be edited.`,
      });
    }

    const {
      expenseDate,
      department,
      title,
      category,
      description,
      amount,
      action, // 'draft' or 'submit'
    } = req.body;

    if (department) voucher.department = department.trim();
    if (title) voucher.title = title.trim();
    if (expenseDate) voucher.expenseDate = new Date(expenseDate);
    if (category) voucher.category = category;
    if (description !== undefined) voucher.description = description.trim();
    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than zero.' });
      }
      voucher.amount = Number(amount);
    }

    // Check if new signature uploaded
    if (req.file) {
      voucher.employeeSignatureKey = await uploadSignature(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    // If submitting now
    if (action === 'submit') {
      if (!voucher.employeeSignatureKey) {
        return res.status(400).json({
          success: false,
          message: 'Employee signature is mandatory before submission.',
        });
      }
      voucher.status = 'Submitted';
    }

    await voucher.save();
    const populatedVoucher = await attachPresignedUrls(voucher, req);

    return res.status(200).json({
      success: true,
      message: action === 'submit' ? 'Voucher submitted successfully for Director approval.' : 'Draft voucher updated successfully.',
      data: populatedVoucher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update voucher',
      error: error.message,
    });
  }
};

/**
 * @desc Delete draft voucher
 * @route DELETE /api/vouchers/:id
 */
export const deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    // Ownership check
    if (voucher.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own vouchers.',
      });
    }

    // Business rule: Can only delete while in Draft status
    if (voucher.status !== 'Draft') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete voucher in '${voucher.status}' status. Only Draft vouchers may be deleted.`,
      });
    }

    await Voucher.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Draft voucher deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete voucher',
      error: error.message,
    });
  }
};

/**
 * @desc Director Review: Approve or Reject
 * @route POST /api/vouchers/:id/review
 */
export const reviewVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ success: false, message: 'Voucher not found' });
    }

    // Director cannot modify employee voucher details, only review Submitted vouchers
    if (voucher.status !== 'Submitted') {
      return res.status(400).json({
        success: false,
        message: `Cannot review voucher with status '${voucher.status}'. Only 'Submitted' vouchers can be approved or rejected.`,
      });
    }

    const { decision, rejectionReason } = req.body;

    if (!decision || !['Approve', 'Reject'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be either 'Approve' or 'Reject'.",
      });
    }

    if (decision === 'Reject') {
      if (!rejectionReason || !rejectionReason.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is mandatory when rejecting a voucher.',
        });
      }
      voucher.status = 'Rejected';
      voucher.rejectionReason = rejectionReason.trim();
      voucher.approvedBy = req.user._id;
      voucher.directorName = req.user.name;
      voucher.approvalDate = new Date();
    } else if (decision === 'Approve') {
      // Validation: Director signature is mandatory before approval
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Director signature image is mandatory for approving a voucher.',
        });
      }

      const directorSignatureKey = await uploadSignature(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      voucher.status = 'Approved';
      voucher.directorSignatureKey = directorSignatureKey;
      voucher.approvedBy = req.user._id;
      voucher.directorName = req.user.name;
      voucher.approvalDate = new Date();
      voucher.rejectionReason = null; // Clear if any
    }

    await voucher.save();
    const populatedVoucher = await attachPresignedUrls(voucher, req);

    return res.status(200).json({
      success: true,
      message: `Voucher ${voucher.voucherNumber} has been ${voucher.status.toLowerCase()} successfully.`,
      data: populatedVoucher,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to review voucher',
      error: error.message,
    });
  }
};

/**
 * @desc Get Dashboard statistics based on user role
 * @route GET /api/vouchers/dashboard-stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const role = req.user.role;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (role === 'Employee') {
      const match = { employee: req.user._id };
      const total = await Voucher.countDocuments(match);
      const draft = await Voucher.countDocuments({ ...match, status: 'Draft' });
      const pending = await Voucher.countDocuments({ ...match, status: 'Submitted' });
      const approved = await Voucher.countDocuments({ ...match, status: 'Approved' });
      const rejected = await Voucher.countDocuments({ ...match, status: 'Rejected' });

      // Total amount claimed
      const amountAgg = await Voucher.aggregate([
        { $match: match },
        { $group: { _id: null, totalClaimed: { $sum: '$amount' } } },
      ]);
      const totalAmountClaimed = amountAgg.length > 0 ? amountAgg[0].totalClaimed : 0;

      return res.status(200).json({
        success: true,
        stats: {
          total,
          draft,
          pending,
          approved,
          rejected,
          totalAmountClaimed,
        },
      });
    }

    if (role === 'Director') {
      const pendingCount = await Voucher.countDocuments({ status: 'Submitted' });
      const approvedToday = await Voucher.countDocuments({
        status: 'Approved',
        approvalDate: { $gte: today },
      });
      const rejectedToday = await Voucher.countDocuments({
        status: 'Rejected',
        approvalDate: { $gte: today },
      });

      // Total pending amount
      const pendingAmountAgg = await Voucher.aggregate([
        { $match: { status: 'Submitted' } },
        { $group: { _id: null, totalPending: { $sum: '$amount' } } },
      ]);
      const totalPendingAmount = pendingAmountAgg.length > 0 ? pendingAmountAgg[0].totalPending : 0;

      // Recent voucher activity (last 5)
      const recentRaw = await Voucher.find()
        .sort({ updatedAt: -1 })
        .limit(5);

      const recentActivity = await Promise.all(
        recentRaw.map((v) => attachPresignedUrls(v, req))
      );

      return res.status(200).json({
        success: true,
        stats: {
          pendingApprovalCount: pendingCount,
          approvedToday,
          rejectedToday,
          totalPendingAmount,
          recentActivity,
        },
      });
    }

    if (role === 'Accounts') {
      const total = await Voucher.countDocuments();
      const pending = await Voucher.countDocuments({ status: 'Submitted' });
      const approved = await Voucher.countDocuments({ status: 'Approved' });
      const rejected = await Voucher.countDocuments({ status: 'Rejected' });

      // Total approved expense amount
      const approvedAmountAgg = await Voucher.aggregate([
        { $match: { status: 'Approved' } },
        { $group: { _id: null, totalApproved: { $sum: '$amount' } } },
      ]);
      const totalApprovedAmount = approvedAmountAgg.length > 0 ? approvedAmountAgg[0].totalApproved : 0;

      // Recent approved vouchers (last 5)
      const recentRaw = await Voucher.find({ status: 'Approved' })
        .sort({ approvalDate: -1 })
        .limit(5);

      const recentApproved = await Promise.all(
        recentRaw.map((v) => attachPresignedUrls(v, req))
      );

      return res.status(200).json({
        success: true,
        stats: {
          total,
          pending,
          approved,
          rejected,
          totalApprovedExpenseAmount: totalApprovedAmount,
          recentApprovedVouchers: recentApproved,
        },
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid role for stats' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats',
      error: error.message,
    });
  }
};
