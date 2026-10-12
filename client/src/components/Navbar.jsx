import React, { useState } from 'react';
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
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Director':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Director (Admin)
          </span>
        );
      case 'Accounts':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Accounts Team
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Employee
          </span>
        );
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
      isActive
        ? 'bg-slate-800 text-white dark:bg-slate-800 dark:text-white border border-slate-700'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold tracking-tight text-white block leading-tight">
                  Prachay EVMS
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Expense Portal</span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 border-l border-slate-800 pl-6">
              <NavLink to="/" end className={navLinkClasses}>
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </NavLink>

              {user?.role === 'Employee' && (
                <>
                  <NavLink to="/vouchers/create" className={navLinkClasses}>
                    <FilePlus className="w-3.5 h-3.5" />
                    Create Voucher
                  </NavLink>
                  <NavLink to="/vouchers" className={navLinkClasses}>
                    <Files className="w-3.5 h-3.5" />
                    My Vouchers
                  </NavLink>
                </>
              )}

              {user?.role === 'Director' && (
                <>
                  <NavLink to="/approvals" className={navLinkClasses}>
                    <CheckSquare className="w-3.5 h-3.5" />
                    Pending Approvals
                  </NavLink>
                  <NavLink to="/vouchers" className={navLinkClasses}>
                    <Files className="w-3.5 h-3.5" />
                    All Vouchers
                  </NavLink>
                </>
              )}

              {user?.role === 'Accounts' && (
                <NavLink to="/vouchers" className={navLinkClasses}>
                  <Files className="w-3.5 h-3.5" />
                  All Organization Vouchers
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right utility items */}
          <div className="flex items-center gap-2.5">
            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            </button>

            {/* User profile summary */}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="text-right">
                <span className="text-xs font-medium text-slate-200 block leading-tight">{user?.name}</span>
                <span className="text-[10px] text-slate-400">{user?.department}</span>
              </div>
              {getRoleBadge(user?.role)}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1 text-left">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Dashboard
            </NavLink>
            {user?.role === 'Employee' && (
              <>
                <NavLink
                  to="/vouchers/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Create Voucher
                </NavLink>
                <NavLink
                  to="/vouchers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  My Vouchers
                </NavLink>
              </>
            )}
            {user?.role === 'Director' && (
              <>
                <NavLink
                  to="/approvals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Pending Approvals
                </NavLink>
                <NavLink
                  to="/vouchers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  All Vouchers
                </NavLink>
              </>
            )}
            {user?.role === 'Accounts' && (
              <NavLink
                to="/vouchers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                All Vouchers
              </NavLink>
            )}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3">
              <span className="text-xs text-slate-400">{user?.name} ({user?.role})</span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 font-medium cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
