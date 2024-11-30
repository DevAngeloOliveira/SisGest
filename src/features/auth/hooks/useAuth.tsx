import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useNotification } from '../../../hooks/useNotification';
import { RegisterCredentials } from '../types/auth.types';

export function useAuth() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const notification = useNotification();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      await context.login(email, password);
      notification.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      notification.error('Erro ao realizar login');
      throw error;
    }
  };

  const handleRegister = async (data: RegisterCredentials) => {
    try {
      await context.register(data);
      notification.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      notification.error(error instanceof Error ? error.message : 'Erro ao realizar cadastro');
      throw error;
    }
  };

  const handleLogout = () => {
    context.logout();
    navigate('/login');
  };

  return {
    ...context,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
} 