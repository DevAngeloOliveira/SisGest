import { Project } from '@/types';
import { Link } from 'react-router-dom';
import { statusColors } from '@/utils/status';

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onDelete: () => Promise<void>;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const statusColor = statusColors[project.status];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <Link
          to={`/projects/${project.id}`}
          className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-500"
        >
          {project.name}
        </Link>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Editar</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500"
          >
            <span className="sr-only">Excluir</span>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {project.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
            {project.status}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${project.priority.toLowerCase()}-100 text-${project.priority.toLowerCase()}-800`}>
            {project.priority}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(project.endDate).toLocaleDateString()}
        </div>
      </div>

      {project.team.length > 0 && (
        <div className="mt-4">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="relative"
                title={member.name}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 bg-primary-500 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {project.team.length > 3 && (
              <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  +{project.team.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 