import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { User } from '@/types/common';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

export const AuthContext = createContext<AuthState & {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}>(initialState as any);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.login(credentials);
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false
      }));
      navigate('/');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to login',
        isLoading: false
      }));
      toast.error('Failed to login. Please check your credentials.');
    }
  }, [navigate]);

  const register = useCallback(async (data: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.register(data);
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false
      }));
      navigate('/');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false
      }));
      toast.error('Failed to register. Please try again.');
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setState(initialState);
      navigate('/auth/login');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  }, [navigate]);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const updatedUser = await authService.updateUser(data);
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false
      }));
      toast.success('User updated successfully');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update user',
        isLoading: false
      }));
      toast.error('Failed to update user. Please try again.');
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize auth'
        });
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 