import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types/project.types';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'react-toastify';

export function ProjectsPage() {
  const navigate = useNavigate();
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
      toast.error('Erro ao carregar projetos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  const handleEditProject = (project: Project) => {
    navigate(`/projects/${project.id}/edit`);
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      await projectService.deleteProject(project.id);
      toast.success('Projeto excluído com sucesso!');
      loadProjects();
    } catch (error) {
      toast.error('Erro ao excluir projeto');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projetos
        </h1>
        <button
          onClick={handleCreateProject}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Novo Projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum projeto encontrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 