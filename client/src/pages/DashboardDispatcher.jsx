import React from 'react';
import { useAuth } from '../context/AuthContext';
import { EmployeeDashboard } from './EmployeeDashboard';
import { DirectorDashboard } from './DirectorDashboard';
import { AccountsDashboard } from './AccountsDashboard';

export const DashboardDispatcher = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'Director':
      return <DirectorDashboard />;
    case 'Accounts':
      return <AccountsDashboard />;
    case 'Employee':
    default:
      return <EmployeeDashboard />;
  }
};
