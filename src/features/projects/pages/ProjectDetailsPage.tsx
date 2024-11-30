import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Project } from '../types/project.types';
import { TaskList } from '../../tasks/components/TaskList';
import { useNotification } from '../../../hooks/useNotification';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const notification = useNotification();

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      // Implementar carregamento do projeto
      setProject(null);
    } catch (error) {
      notification.error('Erro ao carregar projeto');
    }
  };

  if (!project) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {project.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tarefas
            </h2>
            <TaskList tasks={project.tasks} />
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detalhes
            </h2>
            {/* Adicionar detalhes do projeto */}
          </div>
        </div>
      </div>
    </div>
  );
} 