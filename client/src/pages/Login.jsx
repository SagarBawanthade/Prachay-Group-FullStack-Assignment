import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Receipt,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.trim()) {
      errs.email = 'Corporate email is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address (e.g., name@domain.com)';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Authentication failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Decorative ambient blurred backdrops */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Glassmorphic Container */}
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl border border-white/40 overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="p-8 text-center border-b border-slate-100">
            <div className="w-13 h-13 bg-slate-900 rounded-xl flex items-center justify-center text-white mx-auto mb-3.5 shadow-md transform hover:scale-105 transition duration-200">
              <Receipt className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Expense Voucher Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Prachay Securities Corporate Reimbursement System
            </p>
          </div>

          <div className="p-8">
            {serverError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-left animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-800">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Email Field with validation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    placeholder="e.g. employee@prachay.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-300 bg-red-50/30 focus:ring-red-400 focus:border-red-400'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-slate-900 focus:border-slate-900'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field with Show/Hide toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-300 bg-red-50/30 focus:ring-red-400 focus:border-red-400'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-slate-900 focus:border-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Portal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Switcher */}
            <div className="mt-7 pt-5 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
                One-Click Role Demonstration
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('employee@prachay.com')}
                  className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/60 hover:bg-blue-100/80 hover:border-blue-300 text-blue-900 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer active:scale-95"
                >
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('director@prachay.com')}
                  className="p-2.5 rounded-xl border border-purple-100 bg-purple-50/60 hover:bg-purple-100/80 hover:border-purple-300 text-purple-900 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Director
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('accounts@prachay.com')}
                  className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100/80 hover:border-emerald-300 text-emerald-900 text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Accounts
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-2.5 font-medium">
                Password: <code className="text-slate-700 font-bold bg-slate-100 px-1 py-0.5 rounded">password123</code>
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <a
                  href="/register"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition underline underline-offset-2"
                >
                  Register a new employee account →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
