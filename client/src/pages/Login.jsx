import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Receipt, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-white text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white mx-auto mb-3 shadow-xs">
              <Receipt className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Expense Voucher Management System
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Prachay Securities Corporate Portal
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-left">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@prachay.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins Bar */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
                One-Click Demo Logins
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('employee@prachay.com')}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Rahul (Eng)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('priya@prachay.com')}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-cyan-600" />
                  Priya (Mkt)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('director@prachay.com')}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Director
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('accounts@prachay.com')}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold text-center transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Accounts
                </button>
              </div>
              <p className="text-[11px] text-slate-500 text-center mt-2 font-medium">
                Demo password: <code className="text-slate-800 font-semibold bg-slate-100 px-1 py-0.5 rounded">password123</code>
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <a
                  href="/register"
                  className="text-xs font-semibold text-slate-900 hover:text-blue-600 underline"
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
