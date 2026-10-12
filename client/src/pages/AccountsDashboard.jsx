import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Receipt,
  ArrowRight,
  TrendingUp,
  Eye,
  BadgeDollarSign,
} from 'lucide-react';

export const AccountsDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/vouchers/dashboard-stats');
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to load accounts stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-1.5">
              <BadgeDollarSign className="w-3.5 h-3.5" /> Finance & Accounts Console
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
              Reimbursement Queue
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Accounts Reimbursement Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Tracking organization-wide approved expenditures, digital signatures, and settlement queue
          </p>
        </div>
        <Link
          to="/vouchers?status=Approved"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Receipt className="w-4 h-4" />
          Process Approved Claims ({stats?.approved || 0})
        </Link>
      </div>

      {/* KPI Cards Grid with Glassmorphism */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Claims */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Claims</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.total || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Company-wide</p>
        </div>

        {/* Pending */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-amber-500/20 dark:border-amber-500/20 shadow-2xs hover:border-amber-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats?.pending || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">With Director</p>
        </div>

        {/* Approved */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-2xs hover:border-emerald-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Approved
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats?.approved || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Ready for payment</p>
        </div>

        {/* Rejected */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-rose-500/20 dark:border-rose-500/20 shadow-2xs hover:border-rose-500/40 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Rejected
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats?.rejected || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Disapproved claims</p>
        </div>

        {/* Approved Outflow Value */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs col-span-2 sm:col-span-1 group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Approved Outflow
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ₹{(stats?.totalApprovedExpenseAmount || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Disbursement pool</p>
        </div>
      </div>

      {/* Recent Approved Vouchers Glass Table */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Recent Approved Claims (Disbursement Ready)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified by Director with dual signatures attached
            </p>
          </div>
          <Link
            to="/vouchers?status=Approved"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition"
          >
            View All Approved <ArrowRight className="w-3.5 h-3.5" />
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
                <th className="px-5 py-3.5">Approval Date</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {!stats?.recentApprovedVouchers || stats.recentApprovedVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">
                    No approved vouchers yet to process.
                  </td>
                </tr>
              ) : (
                stats.recentApprovedVouchers.map((voucher) => (
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
                    <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      ₹{voucher.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {voucher.approvalDate
                        ? new Date(voucher.approvalDate).toLocaleDateString()
                        : 'Approved'}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/vouchers/${voucher._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
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
