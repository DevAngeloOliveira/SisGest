import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { Permission } from '../types/common';

interface ProtectedRouteProps {
  children: ReactNode;
  permissions?: Permission[];
}

export function ProtectedRoute({ children, permissions = [] }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (permissions.length > 0 && !hasAnyPermission(permissions)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 