import { Project } from '../types/projects.types';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {project.description}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Criado em: {formatDate(project.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
} 