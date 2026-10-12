import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Search,
  Filter,
  ArrowUpDown,
  FilePlus,
  Trash2,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  IndianRupee,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Travel & Conveyance',
  'Meals & Entertainment',
  'Office Supplies',
  'Software & Subscriptions',
  'Hardware & Equipment',
  'Training & Certification',
  'Client Meeting',
  'Medical & Health',
  'Utilities',
  'Other',
];

const STATUSES = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected'];

const DEPARTMENTS = [
  'All',
  'Engineering',
  'Finance & Accounts',
  'Human Resources',
  'Marketing & Sales',
  'Operations',
  'Executive Management',
  'Legal & Compliance',
];

export const VoucherList = ({ defaultStatus = 'All', titleOverride = null }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || defaultStatus);
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [minAmount, setMinAmount] = useState(searchParams.get('minAmount') || '');
  const [maxAmount, setMaxAmount] = useState(searchParams.get('maxAmount') || '');

  // Sorting state
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sortBy,
        order,
      };

      if (search) params.search = search;
      if (status && status !== 'All') params.status = status;
      if (department && department !== 'All') params.department = department;
      if (category && category !== 'All') params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (minAmount) params.minAmount = minAmount;
      if (maxAmount) params.maxAmount = maxAmount;

      const res = await api.get('/vouchers', { params });
      if (res.data.success) {
        setVouchers(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [page, status, department, category, sortBy, order]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVouchers();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus(defaultStatus);
    setDepartment('All');
    setCategory('All');
    setStartDate('');
    setEndDate('');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
  };

  const handleDelete = async (id, voucherNumber) => {
    if (window.confirm(`Are you sure you want to delete draft voucher ${voucherNumber}?`)) {
      try {
        await api.delete(`/vouchers/${id}`);
        fetchVouchers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete draft voucher.');
      }
    }
  };

  const pageTitle =
    titleOverride ||
    (user?.role === 'Employee'
      ? 'My Expense Vouchers'
      : user?.role === 'Director'
      ? 'Director Voucher Ledger'
      : 'All Organization Expense Vouchers');

  return (
    <div className="space-y-6 text-left">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{pageTitle}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Search, filter, and review voucher reimbursement workflows.
          </p>
        </div>

        {user?.role === 'Employee' && (
          <Link
            to="/vouchers/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition"
          >
            <FilePlus className="w-4 h-4" />
            New Voucher
          </Link>
        )}
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search voucher #, title, employee, department..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition cursor-pointer"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Extended Filters row: Department, Category, Date range, Amount */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="w-full p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full p-1.5 rounded-lg border border-slate-200 bg-white truncate"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full p-1.5 rounded-lg border border-slate-200 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full p-1.5 rounded-lg border border-slate-200 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Min ₹
            </label>
            <input
              type="number"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              onBlur={() => {
                setPage(1);
                fetchVouchers();
              }}
              className="w-full p-1.5 rounded-lg border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Max ₹
            </label>
            <input
              type="number"
              placeholder="100000"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              onBlur={() => {
                setPage(1);
                fetchVouchers();
              }}
              className="w-full p-1.5 rounded-lg border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th
                  onClick={() => {
                    setSortBy('voucherNumber');
                    setOrder(order === 'asc' ? 'desc' : 'asc');
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    Voucher # <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortBy('expenseDate');
                    setOrder(order === 'asc' ? 'desc' : 'asc');
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    Expense Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                {user?.role !== 'Employee' && <th className="px-5 py-3.5">Employee</th>}
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th
                  onClick={() => {
                    setSortBy('amount');
                    setOrder(order === 'asc' ? 'desc' : 'asc');
                  }}
                  className="px-5 py-3.5 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    Amount <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-xs">Loading records...</p>
                  </td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                    No vouchers found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-mono font-bold text-xs text-indigo-600">
                      {voucher.voucherNumber}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                      {new Date(voucher.expenseDate).toLocaleDateString()}
                    </td>
                    {user?.role !== 'Employee' && (
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 text-xs">
                          {voucher.employeeName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {voucher.employeeId || 'ID: N/A'}
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                      {voucher.department}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800 max-w-xs truncate">
                      {voucher.title}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                        {voucher.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                      ₹{voucher.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={voucher.status} />
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/vouchers/${voucher._id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Employee can only edit or delete while in Draft status */}
                        {user?.role === 'Employee' && voucher.status === 'Draft' && (
                          <>
                            <Link
                              to={`/vouchers/${voucher._id}/edit`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                              title="Edit Draft"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(voucher._id, voucher.voucherNumber)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing page <strong className="text-slate-800">{pagination.page}</strong> of{' '}
              <strong className="text-slate-800">{pagination.totalPages}</strong> (
              {pagination.total} total vouchers)
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
