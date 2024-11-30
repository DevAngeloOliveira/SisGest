import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { projectService } from '../features/projects/services/projectService';
import { Card } from '../components/shared/Card';

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <Link
          to="/projects/new"
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          Novo Projeto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} title={project.name}>
            <div className="space-y-4">
              <p className="text-gray-600 line-clamp-2">{project.description}</p>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status: {project.status}</span>
                <span className="text-gray-500">
                  Progresso: {project.progress}%
                </span>
              </div>

              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${project.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Gerente:</span>
                <div className="flex items-center">
                  {project.manager.avatar ? (
                    <img
                      src={project.manager.avatar}
                      alt={project.manager.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {project.manager.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="ml-2 text-sm">{project.manager.name}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to={`/projects/${project.id}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 