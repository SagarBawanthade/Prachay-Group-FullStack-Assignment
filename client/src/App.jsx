import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { DashboardDispatcher } from './pages/DashboardDispatcher';
import { VoucherForm } from './pages/VoucherForm';
import { VoucherList } from './pages/VoucherList';
import { VoucherDetails } from './pages/VoucherDetails';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Home Dashboard: dynamic per role */}
              <Route path="/" element={<DashboardDispatcher />} />

              {/* Vouchers view: accessible by all authenticated roles (scoped inside backend) */}
              <Route path="/vouchers" element={<VoucherList />} />
              <Route path="/vouchers/:id" element={<VoucherDetails />} />

              {/* Employee-only routes */}
              <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
                <Route path="/vouchers/create" element={<VoucherForm />} />
                <Route path="/vouchers/:id/edit" element={<VoucherForm />} />
              </Route>

              {/* Director-only pending approvals route */}
              <Route element={<ProtectedRoute allowedRoles={['Director']} />}>
                <Route
                  path="/approvals"
                  element={
                    <VoucherList
                      defaultStatus="Submitted"
                      titleOverride="Director Approval Queue"
                    />
                  }
                />
              </Route>
            </Route>
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
