import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ErrorPage } from './pages/ErrorPage';
import { LogsPage } from './pages/admin/LogsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { RootLayout } from './layouts/RootLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ReportsPage } from './pages/admin/ReportsPage';
import { ProjectListPage } from './features/projects/pages/ProjectListPage';
import { ProjectDetailsPage } from './features/projects/pages/ProjectDetailsPage';
import { ProjectFormPage } from './features/projects/pages/ProjectFormPage';
import { TasksPage } from './pages/TasksPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Rotas públicas
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      // Rotas protegidas
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/',
            element: (
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            ),
          },
          // Rotas de Projetos
          {
            path: '/projects',
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute>
                    <ProjectListPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'new',
                element: (
                  <ProtectedRoute 
                    requiredPermission="create_project"
                    allowedRoles={['ADMIN', 'MANAGER']}
                  >
                    <ProjectFormPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ':id',
                element: (
                  <ProtectedRoute>
                    <ProjectDetailsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ':id/edit',
                element: (
                  <ProtectedRoute 
                    requiredPermission="edit_project"
                    allowedRoles={['ADMIN', 'MANAGER']}
                  >
                    <ProjectFormPage />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          // Rotas Administrativas
          {
            path: '/admin',
            children: [
              {
                path: 'users',
                element: (
                  <ProtectedRoute 
                    requiredPermission="manage_users" 
                    allowedRoles={['ADMIN']}
                  >
                    <UsersPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'logs',
                element: (
                  <ProtectedRoute 
                    requiredPermission="view_logs" 
                    allowedRoles={['ADMIN']}
                  >
                    <LogsPage />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          // Outras rotas protegidas
          {
            path: '/reports',
            element: (
              <ProtectedRoute 
                requiredPermission="view_reports" 
                allowedRoles={['ADMIN', 'MANAGER']}
              >
                <ReportsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/tasks',
            element: (
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]); 