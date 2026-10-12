import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  FilePlus,
  Files,
  CheckSquare,
  LogOut,
  Receipt,
  User,
  Shield,
  CreditCard,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Director':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            <Shield className="w-3 h-3" /> Director (Admin)
          </span>
        );
      case 'Accounts':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <CreditCard className="w-3 h-3" /> Accounts Team
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            <User className="w-3 h-3" /> Employee
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Receipt className="w-5 h-5 text-indigo-400 dark:text-white" />
              </div>
              <div className="text-left">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white block leading-tight">
                  Prachay EVMS
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expense Voucher System</span>
              </div>
            </NavLink>

            {/* Navigation links based on role */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>

              {user?.role === 'Employee' && (
                <>
                  <NavLink
                    to="/vouchers/create"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <FilePlus className="w-4 h-4" />
                    Create Voucher
                  </NavLink>
                  <NavLink
                    to="/vouchers"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Files className="w-4 h-4" />
                    My Vouchers
                  </NavLink>
                </>
              )}

              {user?.role === 'Director' && (
                <>
                  <NavLink
                    to="/approvals"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <CheckSquare className="w-4 h-4" />
                    Pending Approvals
                  </NavLink>
                  <NavLink
                    to="/vouchers"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Files className="w-4 h-4" />
                    All Vouchers
                  </NavLink>
                </>
              )}

              {user?.role === 'Accounts' && (
                <NavLink
                  to="/vouchers"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Files className="w-4 h-4" />
                  All Organization Vouchers
                </NavLink>
              )}
            </nav>
          </div>

          {/* User profile, Theme Toggle & Logout */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                {getRoleBadge(user?.role)}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
