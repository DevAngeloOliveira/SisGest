import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../features/auth/contexts/AuthContext';

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
} 