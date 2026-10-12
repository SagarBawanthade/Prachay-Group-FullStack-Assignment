import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-red-100 dark:border-red-900/50 p-8 text-center">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Your role (<span className="font-semibold text-slate-800 dark:text-slate-200">{user.role}</span>) does not have permission to view this section.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            Go to Your Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
