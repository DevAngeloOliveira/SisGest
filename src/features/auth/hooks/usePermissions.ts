import { Permission } from '@/types/common';
import { useAuth } from '@/hooks/useAuth';

export function usePermissions() {
    const { user } = useAuth();

    const hasPermission = (permission: Permission) => {
        if (!user) return false;
        return user.permissions.includes(permission) || user.permissions.includes('all');
    };

    const hasAnyPermission = (permissions: Permission[]) => {
        if (!user) return false;
        return permissions.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (permissions: Permission[]) => {
        if (!user) return false;
        return permissions.every(permission => hasPermission(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions
    };
} 