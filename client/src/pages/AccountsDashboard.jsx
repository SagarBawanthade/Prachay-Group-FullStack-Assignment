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
  IndianRupee,
  ArrowRight,
  Printer,
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
      <div className="py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 inline-flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Accounts & Finance Console
          </span>
          <h1 className="text-2xl font-bold mt-2 text-slate-900">
            Reimbursement Monitoring
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Tracking organization-wide approved expenditures, audit signatures, and payment queue.
          </p>
        </div>
        <Link
          to="/vouchers?status=Approved"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition shadow-xs cursor-pointer"
        >
          <Receipt className="w-4 h-4" />
          Process Approved Vouchers ({stats?.approved || 0})
        </Link>
      </div>

      {/* Accounts KPI Grid as requested in Assignment */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Vouchers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Vouchers</span>
            <Receipt className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-3xl font-black text-slate-800">{stats?.total || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Total company requests</p>
        </div>

        {/* Pending Approval */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approval</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-600">{stats?.pending || 0}</p>
          <p className="text-xs text-slate-400 mt-1">With Director</p>
        </div>

        {/* Approved Vouchers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">{stats?.approved || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Ready for payment</p>
        </div>

        {/* Rejected Vouchers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-600">{stats?.rejected || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Disapproved claims</p>
        </div>

        {/* Total Approved Expense Amount */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Approved Outflow</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{(stats?.totalApprovedExpenseAmount || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">Payable amount</p>
        </div>
      </div>

      {/* Recent Approved Vouchers ready for reimbursement */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Approved Vouchers (Payment Ready)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified by Director with digital signature attached
            </p>
          </div>
          <Link
            to="/vouchers?status=Approved"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            View All Approved <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {!stats?.recentApprovedVouchers || stats.recentApprovedVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    No approved vouchers yet to process.
                  </td>
                </tr>
              ) : (
                stats.recentApprovedVouchers.map((voucher) => (
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
                    <td className="px-5 py-4 font-bold text-emerald-700">
                      ₹{voucher.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {voucher.approvalDate
                        ? new Date(voucher.approvalDate).toLocaleDateString()
                        : 'Approved'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/vouchers/${voucher._id}`}
                        className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-lg border border-emerald-200 transition inline-flex items-center gap-1"
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
