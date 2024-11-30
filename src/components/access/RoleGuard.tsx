import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
    children: ReactNode;
    roles: string[];
}

export function RoleGuard({ children, roles }: RoleGuardProps) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
} 