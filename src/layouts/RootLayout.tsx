import { Outlet } from 'react-router-dom';
import { NotificationProvider } from '../providers/NotificationProvider';

export function RootLayout() {
  return (
    <NotificationProvider>
      <Outlet />
    </NotificationProvider>
  );
} 