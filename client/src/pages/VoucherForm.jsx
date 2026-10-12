import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { SignatureUpload } from '../components/SignatureUpload';
import {
  FilePlus,
  Save,
  Send,
  ArrowLeft,
  Building2,
  Calendar,
  Layers,
  IndianRupee,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react';

const CATEGORIES = [
  'Travel & Conveyance',
  'Meals & Entertainment',
  'Office Supplies',
  'Software & Subscriptions',
  'Hardware & Equipment',
  'Training & Certification',
  'Client Meeting',
  'Medical & Health',
  'Utilities',
  'Other',
];

const DEPARTMENTS = [
  'Engineering',
  'Finance & Accounts',
  'Human Resources',
  'Marketing & Sales',
  'Operations',
  'Executive Management',
  'Legal & Compliance',
];

export const VoucherForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [department, setDepartment] = useState(user?.department || 'Engineering');
  const [title, setTitle] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [signatureFile, setSignatureFile] = useState(null);
  const [existingSignatureUrl, setExistingSignatureUrl] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchVoucher = async () => {
        try {
          setFetching(true);
          const res = await api.get(`/vouchers/${id}`);
          if (res.data.success) {
            const v = res.data.data;
            if (v.status !== 'Draft') {
              alert('Only vouchers in Draft status can be edited.');
              navigate(`/vouchers/${id}`);
              return;
            }
            setDepartment(v.department);
            setTitle(v.title);
            setExpenseDate(new Date(v.expenseDate).toISOString().split('T')[0]);
            setCategory(v.category);
            setDescription(v.description || '');
            setAmount(String(v.amount));
            setExistingSignatureUrl(v.employeeSignatureUrl || null);
          }
        } catch (err) {
          alert('Failed to load voucher for editing');
          navigate('/vouchers');
        } finally {
          setFetching(false);
        }
      };

      fetchVoucher();
    }
  }, [id, isEdit, navigate]);

  const validate = (action) => {
    const errs = {};
    if (!department.trim()) errs.department = 'Department is mandatory.';
    if (!title.trim()) errs.title = 'Expense title is mandatory.';
    if (!expenseDate) errs.expenseDate = 'Expense date is mandatory.';
    if (!amount || Number(amount) <= 0) {
      errs.amount = 'Amount is mandatory and must be greater than zero.';
    }

    if (action === 'submit') {
      if (!signatureFile && !existingSignatureUrl) {
        errs.signature = 'Employee signature image is mandatory before submission.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (action) => {
    if (!validate(action)) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('department', department);
      formData.append('title', title);
      formData.append('expenseDate', expenseDate);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('amount', amount);
      formData.append('action', action);

      if (signatureFile) {
        formData.append('signature', signatureFile);
      }

      if (isEdit) {
        await api.put(`/vouchers/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/vouchers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/vouchers');
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="w-8 h-8 border-3 border-slate-900 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Top Header Card */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/vouchers"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-2xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEdit ? 'Edit Draft Expense Voucher' : 'Create New Expense Voucher'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Submit accurate reimbursement particulars according to corporate finance policy
            </p>
          </div>
        </div>
      </div>

      {/* Main Glass Form Card */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 sm:p-8 space-y-6">
        {/* User Context Metadata */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              Claimant Name
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
              {user?.name}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              Employee ID
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 block font-mono">
              {user?.employeeId || 'EMP-1042'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              Target Lifecycle
            </span>
            <span className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
              {isEdit ? 'Draft (In Progress)' : 'Draft (Auto-Assigned)'}
            </span>
          </div>
        </div>

        {/* Inputs Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:outline-none transition ${
                  errors.department
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                }`}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            {errors.department && (
              <p className="text-xs text-rose-600 mt-1">{errors.department}</p>
            )}
          </div>

          {/* Expense Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Expense Incurred Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-950 dark:[color-scheme:dark] transition ${
                  errors.expenseDate
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                }`}
              />
            </div>
            {errors.expenseDate && (
              <p className="text-xs text-rose-600 mt-1">{errors.expenseDate}</p>
            )}
          </div>

          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Expense Title / Purpose <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Flight travel tickets for Mumbai regional client pilot meeting"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-950 transition ${
                errors.title
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:outline-none transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Amount (INR ₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-950 transition ${
                  errors.amount
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500'
                }`}
              />
            </div>
            {errors.amount && <p className="text-xs text-rose-600 mt-1">{errors.amount}</p>}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Expense Item Description / Bill Remarks
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide itemized details, invoice numbers, or business justification..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-slate-900 dark:focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Signature Upload */}
          <div className="sm:col-span-2">
            <SignatureUpload
              label="Employee Digital Signature"
              signatureFile={signatureFile}
              setSignatureFile={setSignatureFile}
              existingUrl={existingSignatureUrl}
              required={false}
              error={errors.signature}
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Drafts can be saved without signature. Signature is required when submitting for Director review.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons with Full Mobile Responsiveness */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            to="/vouchers"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition text-center cursor-pointer"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('draft')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('submit')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};
