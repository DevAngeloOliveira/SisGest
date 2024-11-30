import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ProjectsPage = lazy(() => import('../pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectFormPage = lazy(() => import('../pages/ProjectFormPage').then(m => ({ default: m.ProjectFormPage })));
const ProjectDetailsPage = lazy(() => import('../pages/ProjectDetailsPage').then(m => ({ default: m.ProjectDetailsPage })));

export const projectRoutes: RouteObject[] = [
  {
    path: '/projects',
    element: (
      <ProtectedRoute permissions={['manage_projects', 'view_projects']}>
        <ProjectsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/projects/new',
    element: (
      <ProtectedRoute permissions={['manage_projects']}>
        <ProjectFormPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/projects/:id',
    element: (
      <ProtectedRoute permissions={['manage_projects', 'view_projects']}>
        <ProjectDetailsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/projects/:id/edit',
    element: (
      <ProtectedRoute permissions={['manage_projects']}>
        <ProjectFormPage />
      </ProtectedRoute>
    )
  }
]; 