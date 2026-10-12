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
        if (res.data.success) {
          setStats(res.data.stats);
        }
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
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header Glass Banner */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 inline-flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Accounts & Finance Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white tracking-tight">
            Reimbursement Monitoring
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Tracking organization-wide approved expenditures, digital signatures, and settlement queue
          </p>
        </div>
        <Link
          to="/vouchers?status=Approved"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Receipt className="w-4 h-4" />
          Process Approved Vouchers ({stats?.approved || 0})
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Vouchers */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Claims</span>
            <Receipt className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.total || 0}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Total company requests</p>
        </div>

        {/* Pending Approval */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-amber-500/20 dark:border-amber-500/20 shadow-xs hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats?.pending || 0}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">With Director</p>
        </div>

        {/* Approved Vouchers */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats?.approved || 0}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Ready for payment</p>
        </div>

        {/* Rejected Vouchers */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-rose-500/20 dark:border-rose-500/20 shadow-xs hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{stats?.rejected || 0}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Disapproved claims</p>
        </div>

        {/* Total Approved Expense Amount */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Approved Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            ₹{(stats?.totalApprovedExpenseAmount || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Payable balance</p>
        </div>
      </div>

      {/* Recent Approved Vouchers Table Glass Container */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Approved Claims (Disbursement Ready)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified by Director with executive approval signature attached
            </p>
          </div>
          <Link
            to="/vouchers?status=Approved"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View All Approved <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200/80 dark:border-slate-800">
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
                  <tr key={voucher._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        {voucher.employeeName}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{voucher.employeeId || 'ID: N/A'}</div>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
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
                        className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-3.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50 transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        Inspect Voucher
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
