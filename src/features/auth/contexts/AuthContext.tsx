import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, LoginCredentials } from '../types/auth.types';
import { cacheService } from '../../../services/cacheService';
import { setupInitialData } from '../utils/initialData';
import { logService } from '../../logs/services/logService';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface UserWithPassword extends User {
  password: string;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setupInitialData();
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const users = cacheService.getUsers();
      const user = users.find(u => {
        const typedUser = u as UserWithPassword;
        return typedUser.email === credentials.email && 
               typedUser.password === credentials.password;
      });

      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Remove a senha antes de armazenar no estado
      const { password: _, ...userWithoutPassword } = user as UserWithPassword;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      // Registra o log de login
      await logService.logUserAction(
        'LOGIN',
        userWithoutPassword.id,
        userWithoutPassword.name,
        userWithoutPassword.role
      );

    } catch (error) {
      await logService.logSystemError(
        error as Error,
        'system',
        'system',
        'SYSTEM'
      );
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const users = cacheService.getUsers();
      
      // Verifica se o email já está em uso
      if (users.some(u => u.email === email)) {
        throw new Error('Este email já está em uso');
      }

      // Cria novo usuário com papel padrão de COLLABORATOR
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        role: 'COLLABORATOR' as UserRole
      };

      // Adiciona o novo usuário à lista
      users.push(newUser);
      cacheService.setUsers(users);

      // Registra o log de criação de usuário
      await logService.logUserAction(
        'LOGIN',
        newUser.id,
        newUser.name,
        newUser.role
      );

      return;
    } catch (error) {
      await logService.logSystemError(
        error as Error,
        'system',
        'system',
        'SYSTEM',
        { action: 'REGISTER', name, email }
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user) {
        // Registra o log de logout
        await logService.logUserAction(
          'LOGOUT',
          user.id,
          user.name,
          user.role
        );
      }
      
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register, 
        isAuthenticated: !!user,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 