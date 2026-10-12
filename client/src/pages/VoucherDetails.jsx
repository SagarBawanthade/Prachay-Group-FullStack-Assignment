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
      <div className="py-16 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!voucher) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Top Action Bar (Print, Back, Edit, Review) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {voucher.voucherNumber}
              </span>
              <StatusBadge status={voucher.status} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{voucher.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Employee Edit Draft button */}
          {user?.role === 'Employee' && voucher.status === 'Draft' && (
            <Link
              to={`/vouchers/${voucher._id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition"
            >
              <Edit3 className="w-4 h-4" /> Edit Draft
            </Link>
          )}

          {/* Director Review button */}
          {user?.role === 'Director' && voucher.status === 'Submitted' && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> Review & Sign
            </button>
          )}

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / PDF
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                PRACHAY SECURITIES
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Corporate Employee Expense Reimbursement Voucher
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Voucher Number
            </p>
            <p className="text-lg font-mono font-black text-slate-900">
              {voucher.voucherNumber}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Issued: {new Date(voucher.voucherDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Expense Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
          <div>
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Department
            </span>
            <span className="font-semibold text-slate-800 text-sm">
              {voucher.department}
            </span>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Expense Incurred Date
            </span>
            <span className="font-semibold text-slate-800 text-sm">
              {new Date(voucher.expenseDate).toLocaleDateString()}
            </span>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Category
            </span>
            <span className="font-semibold text-slate-800 text-sm">
              {voucher.category}
            </span>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Voucher Status
            </span>
            <div className="mt-0.5">
              <StatusBadge status={voucher.status} />
            </div>
          </div>
        </div>

        {/* Claim Breakdown Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Expense Particulars & Justification
          </h3>
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-base font-bold text-slate-800">{voucher.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {voucher.description || 'No additional narrative description provided.'}
            </p>
          </div>
        </div>

        {/* Total Amount Summary Box */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 bg-slate-900 text-white p-5 rounded-xl text-right shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Reimbursable Amount
            </span>
            <span className="text-3xl font-black text-white mt-1 block">
              ₹{voucher.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Signatures & Audit Information Section */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Employee Signature Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Employee Submission
              </span>
              <span className="text-[11px] text-slate-400">
                {voucher.employeeId || 'ID: EMP-1042'}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-800">{voucher.employeeName}</p>

            {voucher.employeeSignatureUrl ? (
              <div className="h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2">
                <img
                  src={voucher.employeeSignatureUrl}
                  alt="Employee Signature"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-24 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                Signature not attached yet
              </div>
            )}
            <p className="text-[11px] text-slate-400 text-center">
              Signed & Verified digitally via Presigned URL
            </p>
          </div>

          {/* Director Approval Signature Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Director Approval
              </span>
              <span className="text-[11px] text-slate-400">
                {voucher.approvalDate
                  ? new Date(voucher.approvalDate).toLocaleDateString()
                  : 'Pending'}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-800">
              {voucher.directorName || (voucher.status === 'Submitted' ? 'Awaiting Director Review' : 'N/A')}
            </p>

            {voucher.directorSignatureUrl ? (
              <div className="h-24 bg-emerald-50/50 border border-emerald-200 rounded-lg flex items-center justify-center p-2">
                <img
                  src={voucher.directorSignatureUrl}
                  alt="Director Signature"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : voucher.status === 'Rejected' ? (
              <div className="h-24 bg-rose-50 border border-rose-200 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                <span className="text-xs font-bold text-rose-700">Rejected by Director</span>
                <span className="text-[11px] text-rose-600 line-clamp-2 mt-0.5">
                  "{voucher.rejectionReason}"
                </span>
              </div>
            ) : (
              <div className="h-24 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                Pending Approval
              </div>
            )}
            <p className="text-[11px] text-slate-400 text-center">
              Executive Authorizer Signature
            </p>
          </div>
        </div>

        {/* Audit footer */}
        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between">
          <span>Created on: {new Date(voucher.createdAt).toLocaleString()}</span>
          <span>Last modified: {new Date(voucher.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Review Modal for Director */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 text-left">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Director Voucher Decision
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review expense claim <span className="font-mono font-bold">{voucher.voucherNumber}</span> for ₹{voucher.amount.toLocaleString('en-IN')}.
              </p>
            </div>

            {reviewError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {reviewError}
              </div>
            )}

            {/* Decision selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approve')}
                className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                  decision === 'Approve'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Approve Voucher
              </button>

              <button
                type="button"
                onClick={() => setDecision('Reject')}
                className={`p-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                  decision === 'Reject'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600" />
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Rejection Reason / Auditor Remarks <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this reimbursement request cannot be approved..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            )}

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
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
