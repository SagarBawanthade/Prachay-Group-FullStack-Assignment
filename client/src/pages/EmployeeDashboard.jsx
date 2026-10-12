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

        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (vouchersRes.data.success) setRecentVouchers(vouchersRes.data.data);
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
      <div className="py-24 flex justify-center items-center">
        <div className="w-7 h-7 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Employee Portal
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {user?.employeeId || 'EMP-1042'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Department: <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.department || 'Engineering'}</span>
          </p>
        </div>
        <Link
          to="/vouchers/create"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
        >
          <FilePlus className="w-3.5 h-3.5" />
          Create New Voucher
        </Link>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Claims
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats?.total || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">All submissions</p>
        </div>

        {/* Drafts */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Drafts
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats?.draft || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Editable claims</p>
        </div>

        {/* Pending */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pending
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {stats?.pending || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Awaiting Director</p>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Approved
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats?.approved || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Ready for payment</p>
        </div>

        {/* Rejected */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Rejected
          </p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {stats?.rejected || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">With feedback</p>
        </div>

        {/* Amount */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Claimed
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            ₹{(stats?.totalAmountClaimed || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Lifetime total</p>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Vouchers</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your latest reimbursement submissions</p>
          </div>
          <Link
            to="/vouchers"
            className="text-xs font-semibold text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Voucher #</th>
                <th className="px-4 py-3">Expense Date</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                    No vouchers created yet. Click "Create New Voucher" to begin.
                  </td>
                </tr>
              ) : (
                recentVouchers.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5 font-mono font-medium text-slate-900 dark:text-slate-200">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {new Date(voucher.expenseDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {voucher.title}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {voucher.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      ₹{voucher.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={voucher.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Link
                        to={`/vouchers/${voucher._id}`}
                        className="text-xs font-medium text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded transition"
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
