import express from 'express';
import {
  getVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  reviewVoucher,
  getDashboardStats,
} from '../controllers/voucherController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All voucher routes require authentication
router.use(authenticate);

// Role dashboard metrics
router.get('/dashboard-stats', getDashboardStats);

// List vouchers with search, filter, pagination
router.get('/', getVouchers);

// Single voucher details
router.get('/:id', getVoucherById);

// Employee actions: create, update, delete
router.post(
  '/',
  authorizeRoles('Employee'),
  upload.single('signature'),
  createVoucher
);

router.put(
  '/:id',
  authorizeRoles('Employee'),
  upload.single('signature'),
  updateVoucher
);

router.delete(
  '/:id',
  authorizeRoles('Employee'),
  deleteVoucher
);

// Director action: Approve / Reject
router.post(
  '/:id/review',
  authorizeRoles('Director'),
  upload.single('signature'),
  reviewVoucher
);

export default router;
