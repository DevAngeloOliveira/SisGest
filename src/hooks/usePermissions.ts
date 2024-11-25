import { useAuth } from '../features/auth/hooks/useAuth';

interface PermissionOptions {
  requireAll?: boolean;
  allowedRoles?: string[];
}

export function usePermissions() {
  const { user } = useAuth();

  const can = (_permission: string, options: PermissionOptions = {}) => {
    if (!user) return false;
    
    if (options.allowedRoles && options.allowedRoles.length > 0) {
      return options.allowedRoles.includes(user.role);
    }
    
    return true;
  };

  return { can };
} 