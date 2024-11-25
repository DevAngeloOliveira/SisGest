import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ProjectsPage = lazy(() => 
  import('../pages/ProjectsPage').then(module => ({ default: module.ProjectsPage }))
);

const ProjectDetailsPage = lazy(() => 
  import('../pages/ProjectDetailsPage').then(module => ({ default: module.ProjectDetailsPage }))
);

const ProjectFormPage = lazy(() => 
  import('../pages/ProjectFormPage').then(module => ({ default: module.ProjectFormPage }))
);

export const projectRoutes: RouteObject[] = [
  {
    path: '/projects',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'COLLABORATOR']}>
        <ProjectsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/projects/new',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
        <ProjectFormPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/projects/:id',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'COLLABORATOR']}>
        <ProjectDetailsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/projects/:id/edit',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
        <ProjectFormPage />
      </ProtectedRoute>
    )
  }
]; 