import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  FilePlus,
  ArrowRight,
  TrendingUp,
  Receipt,
  Sparkles,
} from 'lucide-react';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentVouchers, setRecentVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, vouchersRes] = await Promise.all([
          api.get('/vouchers/dashboard-stats'),
          api.get('/vouchers?limit=5&sortBy=createdAt&order=desc'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (vouchersRes.data.success) {
          setRecentVouchers(vouchersRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Welcome & Action Glass Banner */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
              Employee Portal
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
              ID: {user?.employeeId || 'EMP-1042'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Department: <strong className="text-slate-700 dark:text-slate-200">{user?.department || 'Engineering'}</strong>
          </p>
        </div>
        <Link
          to="/vouchers/create"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          Create New Voucher
        </Link>
      </div>

      {/* KPI Cards Grid with Glassmorphic styling */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Vouchers */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total</span>
            <Receipt className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.total || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">All submissions</p>
        </div>

        {/* Draft Vouchers */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Drafts</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.draft || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Editable claims</p>
        </div>

        {/* Pending Approval */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-4.5 rounded-2xl border border-amber-500/20 dark:border-amber-500/20 shadow-xs hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats?.pending || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">With Director</p>
        </div>

        {/* Approved Vouchers */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-4.5 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats?.approved || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Ready for Accounts</p>
        </div>

        {/* Rejected Vouchers */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-4.5 rounded-2xl border border-rose-500/20 dark:border-rose-500/20 shadow-xs hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats?.rejected || 0}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">See remarks</p>
        </div>

        {/* Total Amount Claimed */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Claimed</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ₹{(stats?.totalAmountClaimed || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Lifetime total</p>
        </div>
      </div>

      {/* Recent Submissions Table Glass Container */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Expense Vouchers</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your latest reimbursement submissions</p>
          </div>
          <Link
            to="/vouchers"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Vouchers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Voucher #</th>
                <th className="px-5 py-3.5">Expense Date</th>
                <th className="px-5 py-3.5">Expense Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">
                    No vouchers created yet. Click "Create New Voucher" to get started.
                  </td>
                </tr>
              ) : (
                recentVouchers.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap">
                      {new Date(voucher.expenseDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {voucher.title}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        {voucher.category}
                      </span>
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
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/50 transition"
                      >
                        Details
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
