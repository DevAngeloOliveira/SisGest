import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { projectService } from '../features/projects/services/projectService';
import { Card } from '../components/shared/Card';
import { motion } from 'framer-motion';
import { useAnimation } from '../hooks/useAnimation';
import { notification } from '../components/shared/Notification';
import { VirtualizedGrid } from '../components/VirtualizedGrid';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useOffline } from '../hooks/useOffline';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { listItem, transition } = useAnimation();
  const { isOffline } = useOffline();

  useEffect(() => {
    let isMounted = true;
    
    const loadProjects = async () => {
      try {
        const data = await projectService.getProjects();
        if (isMounted) {
          setProjects(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading projects:', error);
          notification.error(
            isOffline 
              ? 'Não foi possível carregar os projetos. Você está offline.'
              : 'Erro ao carregar projetos'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();
    return () => { isMounted = false };
  }, [isOffline]);

  const getManagerInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'S';
  };

  const renderProject = (project: Project, style: React.CSSProperties) => (
    <motion.div
      key={project.id}
      variants={listItem}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      style={style}
    >
      <Card title={project.name}>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
            {project.description}
          </p>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Status: {project.status}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Progresso: {project.progress}%
            </span>
          </div>

          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
              <div
                style={{ width: `${project.progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
              ></div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Gerente:
            </span>
            <div className="flex items-center">
              {project.manager?.avatar ? (
                <img
                  src={project.manager.avatar}
                  alt={project.manager.name}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {getManagerInitial(project.manager?.name)}
                  </span>
                </div>
              )}
              <span className="ml-2 text-sm dark:text-gray-300">
                {project.manager?.name || 'Sistema'}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to={`/projects/${project.id}`}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Ver detalhes
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <div className="flex items-center gap-4">
          {isOffline && (
            <span className="text-yellow-600 dark:text-yellow-400 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Modo Offline
            </span>
          )}
          <Link
            to="/projects/new"
            className={`btn btn-primary ${isOffline ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={e => {
              if (isOffline) {
                e.preventDefault();
                notification.warning('Não é possível criar novos projetos no modo offline');
              }
            }}
          >
            Novo Projeto
          </Link>
        </div>
      </div>

      <VirtualizedGrid
        items={projects}
        renderItem={renderProject}
        itemHeight={350}
        gap={24}
      />
    </div>
  );
} 