import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNotification } from '../../../hooks/useNotification';
import { Project, ProjectFormData } from '../types/projects.types';
import { projectService } from '../services/projectService';

export function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const { user } = useAuth();
  const notification = useNotification();

  useEffect(() => {
    void loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const allProjects = await projectService.getProjects();
      setProjectsList(allProjects);
    } catch {
      notification.error('Erro ao carregar projetos');
    }
  };

  const handleCreateProject = async (projectData: ProjectFormData) => {
    try {
      if (!user) return;
      
      await projectService.createProject(
        projectData,
        user.id,
        user.name,
        user.role
      );
      
      notification.success('Projeto criado com sucesso!');
      await loadProjects();
    } catch {
      notification.error('Erro ao criar projeto');
    }
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => handleCreateProject}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Novo Projeto
      </button>

      {projectsList.map(project => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
} 