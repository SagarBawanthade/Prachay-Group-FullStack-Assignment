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
              Executive Console
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Director Review
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Approval Management Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Reviewing expense vouchers and audit compliance across all departments
          </p>
        </div>
        <Link
          to="/approvals"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Pending Approvals ({stats?.pendingApprovalCount || 0})
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Pending */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pending Approval
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {stats?.pendingApprovalCount || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Awaiting digital signature</p>
        </div>

        {/* Approved Today */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Approved Today
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats?.approvedToday || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Since 12:00 AM</p>
        </div>

        {/* Rejected Today */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Rejected Today
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {stats?.rejectedToday || 0}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Returned with remarks</p>
        </div>

        {/* Pending Amount */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pending Claim Value
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ₹{(stats?.totalPendingAmount || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Queue balance</p>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pending Approval Queue</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Vouchers waiting for your authorization</p>
            </div>
          </div>
          <Link
            to="/approvals"
            className="text-xs font-semibold text-slate-900 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
          >
            Review All ({stats?.pendingApprovalCount || 0}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Voucher #</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                    No pending vouchers awaiting approval right now.
                  </td>
                </tr>
              ) : (
                pendingVouchers.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5 font-mono font-medium text-slate-900 dark:text-slate-200">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">
                        {voucher.employeeName}
                      </div>
                      <div className="text-[10px] text-slate-400">{voucher.employeeId || 'ID: N/A'}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">
                      {voucher.department}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {voucher.title}
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
                        className="text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 px-3 py-1 rounded transition"
                      >
                        Review
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
