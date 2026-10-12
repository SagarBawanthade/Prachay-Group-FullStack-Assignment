import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { WorkflowStepper } from '../components/WorkflowStepper';
import { SignatureUpload } from '../components/SignatureUpload';
import {
  ArrowLeft,
  Printer,
  Calendar,
  Building2,
  Layers,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  CreditCard,
  Edit3,
  BadgeCheck,
  Receipt,
  FileSignature,
} from 'lucide-react';

export const VoucherDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review modal state (For Director)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [decision, setDecision] = useState('Approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [directorSignatureFile, setDirectorSignatureFile] = useState(null);
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchVoucher = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/vouchers/${id}`);
      if (res.data.success) {
        setVoucher(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load voucher details');
      navigate('/vouchers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');

    if (decision === 'Reject' && !rejectionReason.trim()) {
      setReviewError('Rejection reason is mandatory if a voucher is rejected.');
      return;
    }

    if (decision === 'Approve' && !directorSignatureFile) {
      setReviewError('Director signature is mandatory before approval.');
      return;
    }

    setReviewLoading(true);
    try {
      const formData = new FormData();
      formData.append('decision', decision);
      if (decision === 'Reject') {
        formData.append('rejectionReason', rejectionReason.trim());
      }
      if (directorSignatureFile) {
        formData.append('signature', directorSignatureFile);
      }

      const res = await api.post(`/vouchers/${id}/review`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setShowReviewModal(false);
        fetchVoucher();
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Review submission failed.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="w-8 h-8 border-3 border-slate-900 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!voucher) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Top Action Bar with Mobile Responsiveness */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {voucher.voucherNumber}
              </span>
              <StatusBadge status={voucher.status} />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
              {voucher.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Employee Edit Draft button */}
          {user?.role === 'Employee' && voucher.status === 'Draft' && (
            <Link
              to={`/vouchers/${voucher._id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Draft
            </Link>
          )}

          {/* Director Review button */}
          {user?.role === 'Director' && voucher.status === 'Submitted' && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
            >
              <FileSignature className="w-4 h-4" /> Review & Sign
            </button>
          )}

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-xs transition cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Visual Workflow Tracker */}
      <div className="print:hidden">
        <WorkflowStepper
          status={voucher.status}
          rejectionReason={voucher.rejectionReason}
        />
      </div>

      {/* Printable Corporate Voucher Sheet */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-7 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-slate-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs">
                P
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                PRACHAY SECURITIES
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Corporate Employee Expense Reimbursement Voucher
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Voucher Number
            </p>
            <p className="text-base sm:text-lg font-mono font-black text-slate-900 dark:text-white mt-0.5">
              {voucher.voucherNumber}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Issued: {new Date(voucher.voucherDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Expense Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-750 text-xs">
          <div>
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">
              Department
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              {voucher.department}
            </span>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">
              Incurred Date
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              {new Date(voucher.expenseDate).toLocaleDateString()}
            </span>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">
              Category
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              {voucher.category}
            </span>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">
              Current Status
            </span>
            <div className="mt-0.5">
              <StatusBadge status={voucher.status} />
            </div>
          </div>
        </div>

        {/* Claim Particulars */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Expense Particulars & Business Justification
          </h3>
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/50 space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {voucher.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {voucher.description || 'No additional narrative description provided.'}
            </p>
          </div>
        </div>

        {/* Total Reimbursable Amount Card */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 bg-slate-900 dark:bg-slate-800 text-white p-5 rounded-xl text-right shadow-sm border border-slate-800 dark:border-slate-700">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Payable Amount
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              ₹{voucher.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Digital Signatures Audit Grid */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Employee Signature Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/60 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Employee Submission
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {voucher.employeeId || 'ID: EMP-1042'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {voucher.employeeName}
            </p>

            {voucher.employeeSignatureUrl ? (
              <div className="h-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center p-2">
                <img
                  src={voucher.employeeSignatureUrl}
                  alt="Employee Signature"
                  className="max-h-full max-w-full object-contain dark:invert"
                />
              </div>
            ) : (
              <div className="h-24 bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                Signature not attached yet
              </div>
            )}
            <p className="text-[10px] text-slate-400 text-center">
              Digitally verified via Short-Lived Presigned Storage URL
            </p>
          </div>

          {/* Director Approval Signature Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850/60 space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Executive Approval
              </span>
              <span className="text-[11px] text-slate-400">
                {voucher.approvalDate
                  ? new Date(voucher.approvalDate).toLocaleDateString()
                  : 'Pending'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {voucher.directorName || (voucher.status === 'Submitted' ? 'Awaiting Director Review' : 'N/A')}
            </p>

            {voucher.directorSignatureUrl ? (
              <div className="h-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center p-2">
                <img
                  src={voucher.directorSignatureUrl}
                  alt="Director Signature"
                  className="max-h-full max-w-full object-contain dark:invert"
                />
              </div>
            ) : voucher.status === 'Rejected' ? (
              <div className="h-24 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Rejected by Director</span>
                <span className="text-[11px] text-rose-600 dark:text-rose-300 line-clamp-2 mt-0.5">
                  "{voucher.rejectionReason}"
                </span>
              </div>
            ) : (
              <div className="h-24 bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                Awaiting Executive Review
              </div>
            )}
            <p className="text-[10px] text-slate-400 text-center">
              Executive Authorizer Signature & Verification
            </p>
          </div>
        </div>

        {/* Audit footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between gap-1">
          <span>Created: {new Date(voucher.createdAt).toLocaleString()}</span>
          <span>Last modified: {new Date(voucher.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Review Modal for Director */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-left animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Director Voucher Decision
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review expense claim <span className="font-mono font-bold">{voucher.voucherNumber}</span> for ₹{voucher.amount.toLocaleString('en-IN')}.
              </p>
            </div>

            {reviewError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-400 font-semibold">
                {reviewError}
              </div>
            )}

            {/* Decision selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approve')}
                className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                  decision === 'Approve'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-800'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Approve Voucher
              </button>

              <button
                type="button"
                onClick={() => setDecision('Reject')}
                className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                  decision === 'Reject'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 ring-2 ring-rose-200 dark:ring-rose-800'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Reject Voucher
              </button>
            </div>

            {/* Approval: Mandatory Director Signature */}
            {decision === 'Approve' && (
              <div>
                <SignatureUpload
                  label="Director Approval Signature"
                  signatureFile={directorSignatureFile}
                  setSignatureFile={setDirectorSignatureFile}
                  required={true}
                />
              </div>
            )}

            {/* Rejection: Mandatory Rejection Reason */}
            {decision === 'Reject' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Rejection Reason / Auditor Remarks <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this reimbursement request cannot be approved..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            )}

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={reviewLoading}
                onClick={handleReviewSubmit}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-sm transition cursor-pointer ${
                  decision === 'Approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                }`}
              >
                {reviewLoading ? 'Processing...' : `Confirm ${decision}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
