import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { UserRole } from '../features/auth/types/auth.types';
import { LoadingScreen } from './LoadingScreen';
import { useNotification } from '../hooks/useNotification';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { can } = usePermissions();
  const location = useLocation();
  const notification = useNotification();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    notification.error('Você não tem permissão para acessar esta página');
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    notification.error('Apenas gerentes e administradores podem acessar esta página');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 