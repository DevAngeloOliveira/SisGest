import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { UserRole } from '../features/auth/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requiredPermission 
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  if (requiredPermission && user?.permissions && !user.permissions.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
} 