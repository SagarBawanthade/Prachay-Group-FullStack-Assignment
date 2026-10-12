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
  AlertCircle,
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
      <div className="py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Director Management Console
          </span>
          <h1 className="text-2xl font-bold mt-2 text-slate-900">
            Overview & Approvals
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Reviewing expense claims across all company departments.
          </p>
        </div>
        <Link
          to="/approvals"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition shadow-xs cursor-pointer"
        >
          <CheckSquare className="w-4 h-4 text-purple-400" />
          Pending Approvals ({stats?.pendingApprovalCount || 0})
        </Link>
      </div>

      {/* KPI Cards Grid according to Director requirements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pending Approval Count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approval</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600">
            {stats?.pendingApprovalCount || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Vouchers awaiting review</p>
        </div>

        {/* Approved Today */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Today</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">
            {stats?.approvedToday || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Approved since midnight</p>
        </div>

        {/* Rejected Today */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected Today</span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-600">
            {stats?.rejectedToday || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Returned with feedback</p>
        </div>

        {/* Total Pending Amount */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pending Value</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{(stats?.totalPendingAmount || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">Pending reimbursement</p>
        </div>
      </div>

      {/* Action Required: Pending Approvals list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Pending Approval Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">Vouchers waiting for your signature or decision</p>
            </div>
          </div>
          <Link
            to="/approvals"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            Review All Pending ({stats?.pendingApprovalCount || 0}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {pendingVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    🎉 Great job! No vouchers currently awaiting your approval.
                  </td>
                </tr>
              ) : (
                pendingVouchers.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-mono font-bold text-xs text-indigo-600">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800 text-sm">
                        {voucher.employeeName}
                      </div>
                      <div className="text-xs text-slate-400">{voucher.employeeId || 'ID: N/A'}</div>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                      {voucher.department}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800 max-w-xs truncate">
                      {voucher.title}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      ₹{voucher.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={voucher.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/vouchers/${voucher._id}`}
                        className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 rounded-lg shadow-2xs transition inline-flex items-center gap-1"
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

      {/* Recent Activity across organization */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Recent Voucher Activity</h2>
            <Link
              to="/vouchers"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              Browse All Vouchers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentActivity.map((v) => (
              <div key={v._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {v.voucherNumber}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{v.title}</p>
                    <p className="text-xs text-slate-400">
                      {v.employeeName} • {v.department} • ₹{v.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={v.status} />
                  <Link
                    to={`/vouchers/${v._id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
