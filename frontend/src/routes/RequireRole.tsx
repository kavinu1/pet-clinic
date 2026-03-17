import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../auth/useAuth';
import type { UserRole } from '../auth/authTypes';

export default function RequireRole({ role }: { role: UserRole }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
