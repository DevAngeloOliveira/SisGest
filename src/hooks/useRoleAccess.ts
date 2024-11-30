import { UserRole } from '@/types';
import { useAuth } from './useAuth';

const roleHierarchy: Record<UserRole, number> = {
    'ADMIN': 3,
    'MANAGER': 2,
    'USER': 1,
    'COLLABORATOR': 0
};

export function useRoleAccess() {
    const { user } = useAuth();

    const hasMinimumRole = (minimumRole: UserRole): boolean => {
        if (!user) return false;
        const userLevel = roleHierarchy[user.role];
        const minimumLevel = roleHierarchy[minimumRole];
        return userLevel >= minimumLevel;
    };

    const hasRole = (allowedRoles: UserRole[]): boolean => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    };

    return {
        hasMinimumRole,
        hasRole,
        isAdmin: user?.role === 'ADMIN',
        isManager: user?.role === 'MANAGER',
        isUser: user?.role === 'USER',
        isCollaborator: user?.role === 'COLLABORATOR'
    };
} 