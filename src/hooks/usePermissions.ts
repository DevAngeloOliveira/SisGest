import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserRole } from '@/features/auth/types/auth.types';

interface UsePermissionsOptions {
  allowedRoles?: UserRole[];
}

export function usePermissions() {
  const { user } = useAuth();

  const can = (permission: string, options: UsePermissionsOptions = {}) => {
    if (!user) return false;

    // Se existem roles permitidas, verifica se o usuário tem uma delas
    if (options.allowedRoles && !options.allowedRoles.includes(user.role)) {
      return false;
    }

    // Permissões por role
    const rolePermissions: Record<UserRole, string[]> = {
      ADMIN: ['*'], // Admin tem todas as permissões
      MANAGER: [
        'view_dashboard',
        'view_projects',
        'manage_projects',
        'view_tasks',
        'manage_tasks',
        'view_reports'
      ],
      COLLABORATOR: [
        'view_dashboard',
        'view_projects',
        'view_tasks',
        'update_tasks'
      ]
    };

    const userPermissions = rolePermissions[user.role];

    // Admin tem acesso a tudo
    if (userPermissions.includes('*')) return true;

    return userPermissions.includes(permission);
  };

  return { can };
} 