export type UserRole = 'ADMIN' | 'MANAGER' | 'COLLABORATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: string[];
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials, remember?: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
} 