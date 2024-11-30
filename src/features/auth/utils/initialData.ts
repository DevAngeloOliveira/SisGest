import { User } from '@/types';

export const adminUser: User = {
  id: '1',
  name: 'Admin',
  email: 'admin@example.com',
  role: 'ADMIN',
  permissions: ['all'],
  avatar: 'https://github.com/admin.png',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'system',
  updatedBy: 'system'
};

export const defaultUsers: User[] = [
  {
    id: '2',
    name: 'User',
    email: 'user@example.com',
    role: 'USER',
    permissions: ['view_projects', 'update_tasks'],
    avatar: 'https://github.com/user.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system'
  },
  {
    id: '3',
    name: 'Manager',
    email: 'manager@example.com',
    role: 'MANAGER',
    permissions: ['manage_projects', 'manage_tasks'],
    avatar: 'https://github.com/manager.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system'
  }
];

export function initializeUsers() {
  const storedUsers = localStorage.getItem('@sisgest:users');
  if (!storedUsers) {
    localStorage.setItem('@sisgest:users', JSON.stringify([adminUser, ...defaultUsers]));
  }
}

export function getInitialUsers(): User[] {
  const storedUsers = localStorage.getItem('@sisgest:users');
  return storedUsers ? JSON.parse(storedUsers) : [adminUser, ...defaultUsers];
} 