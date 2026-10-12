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
  User,
  Shield,
  CreditCard,
  Building2,
  ChevronDown,
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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Director':
        return <Shield className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Accounts':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <User className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? 'bg-slate-900 text-white dark:bg-white/10 dark:text-white shadow-xs border border-slate-700/50'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Platform Title */}
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-slate-900/10 group-hover:scale-105 transition-transform duration-200">
                <Receipt className="w-4.5 h-4.5 text-indigo-400 dark:text-white" />
              </div>
              <div className="text-left">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white block leading-tight">
                  Prachay EVMS
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  Corporate Expense Management
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 border-l border-slate-200/80 dark:border-slate-800 pl-6">
              <NavLink to="/" end className={navLinkClasses}>
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </NavLink>

              {user?.role === 'Employee' && (
                <>
                  <NavLink to="/vouchers/create" className={navLinkClasses}>
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>Create Voucher</span>
                  </NavLink>
                  <NavLink to="/vouchers" className={navLinkClasses}>
                    <Files className="w-3.5 h-3.5" />
                    <span>My Vouchers</span>
                  </NavLink>
                </>
              )}

              {user?.role === 'Director' && (
                <>
                  <NavLink to="/approvals" className={navLinkClasses}>
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Pending Approvals</span>
                  </NavLink>
                  <NavLink to="/vouchers" className={navLinkClasses}>
                    <Files className="w-3.5 h-3.5" />
                    <span>All Vouchers</span>
                  </NavLink>
                </>
              )}

              {user?.role === 'Accounts' && (
                <NavLink to="/vouchers" className={navLinkClasses}>
                  <Files className="w-3.5 h-3.5" />
                  <span>All Organization Vouchers</span>
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right Utility Navigation: User Profile, Theme Toggle & Logout */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 cursor-pointer shadow-2xs"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* User Profile Glass Pill */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
                {getRoleIcon(user?.role)}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                  {user?.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {user?.role} • {user?.department}
                </span>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 cursor-pointer shadow-2xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer with glassmorphism */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 text-left animate-fadeIn">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              <span>Dashboard</span>
            </NavLink>

            {user?.role === 'Employee' && (
              <>
                <NavLink
                  to="/vouchers/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  <FilePlus className="w-4 h-4 text-indigo-500" />
                  <span>Create Voucher</span>
                </NavLink>
                <NavLink
                  to="/vouchers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  <Files className="w-4 h-4 text-indigo-500" />
                  <span>My Vouchers</span>
                </NavLink>
              </>
            )}

            {user?.role === 'Director' && (
              <>
                <NavLink
                  to="/approvals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  <CheckSquare className="w-4 h-4 text-indigo-500" />
                  <span>Pending Approvals</span>
                </NavLink>
                <NavLink
                  to="/vouchers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  <Files className="w-4 h-4 text-indigo-500" />
                  <span>All Vouchers</span>
                </NavLink>
              </>
            )}

            {user?.role === 'Accounts' && (
              <NavLink
                to="/vouchers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
              >
                <Files className="w-4 h-4 text-indigo-500" />
                <span>All Vouchers</span>
              </NavLink>
            )}

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
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
