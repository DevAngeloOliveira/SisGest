import { createContext, useCallback, useEffect, useState } from 'react';
import { User, UserRole } from '../types/auth.types';
import { logService } from '../../logs/services/logService';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      if (!password) {
        throw new Error('Senha é obrigatória');
      }

      const mockUser: User = {
        id: '1',
        name: 'Admin',
        email,
        role: 'ADMIN' as UserRole
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

      await logService.logUserAction(
        'USER_LOGIN',
        mockUser.id,
        mockUser.name,
        mockUser.role
      );
    } catch (error) {
      await logService.logUserAction(
        'SYSTEM_ERROR',
        'system',
        'system',
        'SYSTEM',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    if (user) {
      await logService.logUserAction(
        'USER_LOGOUT',
        user.id,
        user.name,
        user.role
      );
    }
    setUser(null);
    localStorage.removeItem('user');
  }, [user]);

  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
} 