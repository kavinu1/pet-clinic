import { Navigate } from 'react-router-dom';

import { useAuth } from '../auth/useAuth';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'staff' ? '/staff' : '/client'} replace />;
}
