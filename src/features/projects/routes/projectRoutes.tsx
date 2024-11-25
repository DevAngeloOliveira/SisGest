import { RouteObject } from 'react-router-dom';
import { ProjectListPage } from '../pages/ProjectListPage';
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage';
import { ProjectFormPage } from '../pages/ProjectFormPage';

export const projectRoutes: RouteObject[] = [
  {
    path: '/projects',
    children: [
      {
        index: true,
        element: <ProjectListPage />
      },
      {
        path: ':id',
        element: <ProjectDetailsPage />
      },
      {
        path: 'new',
        element: <ProjectFormPage />
      },
      {
        path: ':id/edit',
        element: <ProjectFormPage />
      }
    ]
  }
]; 