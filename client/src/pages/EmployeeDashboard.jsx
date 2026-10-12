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
  IndianRupee,
  FilePlus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
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
      <div className="py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Welcome & Action Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              Employee Portal
            </span>
            <span className="text-xs text-slate-500">ID: {user?.employeeId || 'EMP-1042'}</span>
          </div>
          <h1 className="text-2xl font-bold mt-2 text-slate-900">
            Welcome, {user?.name}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Department: <strong className="text-slate-700">{user?.department || 'Engineering'}</strong>
          </p>
        </div>
        <Link
          to="/vouchers/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition shadow-xs cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          Create New Voucher
        </Link>
      </div>

      {/* KPI Cards Grid according to PDF Specification */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Vouchers */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total</span>
            <Receipt className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">{stats?.total || 0}</p>
          <p className="text-xs text-slate-400 mt-1">All submissions</p>
        </div>

        {/* Draft Vouchers */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Drafts</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">{stats?.draft || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Editable vouchers</p>
        </div>

        {/* Pending Approval */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{stats?.pending || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting Director</p>
        </div>

        {/* Approved Vouchers */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{stats?.approved || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Ready for Accounts</p>
        </div>

        {/* Rejected Vouchers */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">{stats?.rejected || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Needs review</p>
        </div>

        {/* Total Amount Claimed */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Claimed</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{(stats?.totalAmountClaimed || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">Lifetime amount</p>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Expense Vouchers</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your latest reimbursement submissions</p>
          </div>
          <Link
            to="/vouchers"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All My Vouchers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Voucher #</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Expense Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    No vouchers created yet. Click "Create New Voucher" to get started.
                  </td>
                </tr>
              ) : (
                recentVouchers.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-mono font-bold text-xs text-indigo-600">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs">
                      {new Date(voucher.expenseDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800 max-w-xs truncate">
                      {voucher.title}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md">
                        {voucher.category}
                      </span>
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
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
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
