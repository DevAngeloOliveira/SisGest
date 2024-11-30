import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then(module => ({ default: module.ProjectsPage })));
const ProjectDetailsPage = lazy(() => import('@/pages/ProjectDetailsPage').then(module => ({ default: module.ProjectDetailsPage })));
const TasksPage = lazy(() => import('@/pages/TasksPage').then(module => ({ default: module.TasksPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
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
    path: '*',
    element: <NotFoundPage />
  }
]; 