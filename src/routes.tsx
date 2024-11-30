import { lazy } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetailsPage').then(m => ({ default: m.ProjectDetailsPage })));
const TasksPage = lazy(() => import('./pages/TasksPage').then(m => ({ default: m.TasksPage })));
const UsersPage = lazy(() => import('./pages/admin/UsersPage').then(m => ({ default: m.UsersPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><Outlet /></AppLayout>,
    children: [
      {
        path: '/',
        element: <ProtectedRoute><HomePage /></ProtectedRoute>
      },
      {
        path: '/projects',
        element: <ProtectedRoute permissions={['manage_projects', 'view_projects']}><ProjectsPage /></ProtectedRoute>
      },
      {
        path: '/projects/:id',
        element: <ProtectedRoute permissions={['manage_projects', 'view_projects']}><ProjectDetailsPage /></ProtectedRoute>
      },
      {
        path: '/tasks',
        element: <ProtectedRoute permissions={['manage_tasks', 'update_tasks']}><TasksPage /></ProtectedRoute>
      },
      {
        path: '/users',
        element: <ProtectedRoute permissions={['all']}><UsersPage /></ProtectedRoute>
      },
      {
        path: '/settings',
        element: <ProtectedRoute permissions={['all']}><SettingsPage /></ProtectedRoute>
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      }
    ]
  }
]); 