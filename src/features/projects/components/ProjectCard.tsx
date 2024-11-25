import { Project } from '../types/project.types';
import { formatDate } from '@/utils/date';
import { getStatusColor } from '@/utils/status';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {project.name}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {project.description}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Excluir
          </button>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(project.startDate)}
        </span>
      </div>
    </div>
  );
} 