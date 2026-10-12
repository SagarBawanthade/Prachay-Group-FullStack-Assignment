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
  ShieldCheck,
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

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (pendingRes.data.success) {
          setPendingVouchers(pendingRes.data.data);
        }
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
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header Glass Banner */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Director Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white tracking-tight">
            Executive Approval Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Reviewing expense claims across all company departments
          </p>
        </div>
        <Link
          to="/approvals"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <CheckSquare className="w-4 h-4" />
          Review Pending Approvals ({stats?.pendingApprovalCount || 0})
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pending Approval Count */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-amber-500/20 dark:border-amber-500/20 shadow-xs hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approval</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {stats?.pendingApprovalCount || 0}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Awaiting your signature</p>
        </div>

        {/* Approved Today */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Today</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {stats?.approvedToday || 0}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Since 12:00 AM</p>
        </div>

        {/* Rejected Today */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-rose-500/20 dark:border-rose-500/20 shadow-xs hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected Today</span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-600 dark:text-rose-400">
            {stats?.rejectedToday || 0}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Returned with feedback</p>
        </div>

        {/* Total Pending Amount */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-2xl border border-purple-500/20 dark:border-purple-500/20 shadow-xs hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Outflow Value</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ₹{(stats?.totalPendingAmount || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Total queue balance</p>
        </div>
      </div>

      {/* Pending Approvals Table Glass Container */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Pending Approval Queue</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vouchers waiting for your digital signature</p>
            </div>
          </div>
          <Link
            to="/approvals"
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            Review All ({stats?.pendingApprovalCount || 0}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Voucher #</th>
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {pendingVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">
                    🎉 Excellent! No pending vouchers awaiting approval right now.
                  </td>
                </tr>
              ) : (
                pendingVouchers.map((voucher) => (
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
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      ₹{voucher.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={voucher.status} />
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/vouchers/${voucher._id}`}
                        className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 rounded-lg shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        Review Voucher
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
