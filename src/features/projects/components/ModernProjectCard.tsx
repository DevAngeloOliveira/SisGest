import { Project } from '../types/project.types';
import { FiCalendar, FiClock, FiUsers, FiMoreVertical } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface ModernProjectCardProps {
  project: Project;
  onMenuClick?: (project: Project) => void;
}

export function ModernProjectCard({ project, onMenuClick }: ModernProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Link
            to={`/projects/${project.id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
          >
            {project.name}
          </Link>
          {onMenuClick && (
            <button
              onClick={() => onMenuClick(project)}
              className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <FiMoreVertical className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FiCalendar className="mr-1.5 h-4 w-4" />
              <span>{new Date(project.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1.5 h-4 w-4" />
              <span>{project.progress}%</span>
            </div>
            <div className="flex items-center">
              <FiUsers className="mr-1.5 h-4 w-4" />
              <span>{project.team.length}</span>
            </div>
          </div>

          <span
            className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${
                project.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  : project.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : project.status === 'ON_HOLD'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
              }
            `}
          >
            {project.status}
          </span>
        </div>

        <div className="mt-4 flex -space-x-2">
          {project.team.slice(0, 3).map(member => (
            <div
              key={member.id}
              className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
            >
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
          ))}
          {project.team.length > 3 && (
            <div className="relative inline-block h-8 w-8">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                +{project.team.length - 3}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 