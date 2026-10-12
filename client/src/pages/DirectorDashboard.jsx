import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  CheckSquare,
  ShieldCheck,
  Eye,
  FileCheck,
} from 'lucide-react';

export const DirectorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingVouchers, setPendingVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, pendingRes] = await Promise.all([
          api.get('/vouchers/dashboard-stats'),
          api.get('/vouchers?status=Submitted&limit=5&sortBy=createdAt&order=asc'),
        ]);

        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (pendingRes.data.success) setPendingVouchers(pendingRes.data.data);
      } catch (err) {
        console.error('Failed to load director dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="w-8 h-8 border-3 border-slate-900 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Glassmorphic Header Card */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 text-xs font-semibold border border-purple-200/50 dark:border-purple-800/50 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Executive Approval Center
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
              Director Review
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Director Approval Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Reviewing expense vouchers and audit compliance across all departments
          </p>
        </div>
        <Link
          to="/approvals"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <CheckSquare className="w-4 h-4" />
          Review Pending Queue ({stats?.pendingApprovalCount || 0})
        </Link>
      </div>

      {/* KPI Cards Grid with Glassmorphism */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Pending */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-amber-500/20 dark:border-amber-500/20 shadow-2xs hover:border-amber-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending Approval
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {stats?.pendingApprovalCount || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Awaiting digital signature</p>
        </div>

        {/* Approved Today */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-2xs hover:border-emerald-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Approved Today
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats?.approvedToday || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Since 12:00 AM</p>
        </div>

        {/* Rejected Today */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-rose-500/20 dark:border-rose-500/20 shadow-2xs hover:border-rose-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Rejected Today
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {stats?.rejectedToday || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Returned with remarks</p>
        </div>

        {/* Pending Amount */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Pending Claim Value
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{(stats?.totalPendingAmount || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Total pending queue</p>
        </div>
      </div>

      {/* Pending Approvals Glass Table */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Pending Approval Queue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Vouchers waiting for executive signature
              </p>
            </div>
          </div>
          <Link
            to="/approvals"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition"
          >
            Review All ({stats?.pendingApprovalCount || 0}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="px-5 py-3.5">Voucher #</th>
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Expense Title</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {pendingVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">
                    No pending vouchers awaiting approval right now.
                  </td>
                </tr>
              ) : (
                pendingVouchers.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">
                        {voucher.employeeName}
                      </div>
                      <div className="text-[10px] text-slate-400">{voucher.employeeId || 'ID: N/A'}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                      {voucher.department}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {voucher.title}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      ₹{voucher.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={voucher.status} />
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/vouchers/${voucher._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg shadow-sm transition"
                      >
                        <FileCheck className="w-3.5 h-3.5" /> Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
