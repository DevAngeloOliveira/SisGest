import { useState, useEffect } from 'react';
import { Project } from '../types/project.types';
import { projectService } from '../services/projectService';
import { useNotification } from '@/hooks/useNotification';

export function ProjectListPage() {
  const notification = useNotification();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data.map(project => ({
        ...project,
        tasks: [],
        timeline: {
          ...project.timeline,
          phases: []
        }
      })));
    } catch {
      notification.error('Erro ao carregar projetos');
    }
  };

  return (
    <div className="space-y-6">
      {projects.map(project => (
        <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {project.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 