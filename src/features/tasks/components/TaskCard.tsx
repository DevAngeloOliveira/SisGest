import { Task } from '@/types';
import { statusColors } from '@/utils/status';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusColor = statusColors[task.status];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
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
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
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
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
            {task.status}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${task.priority.toLowerCase()}-100 text-${task.priority.toLowerCase()}-800`}>
            {task.priority}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      </div>

      {task.assignee && (
        <div className="mt-4 flex items-center">
          {task.assignee.avatar ? (
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {task.assignee.name.charAt(0)}
              </span>
            </div>
          )}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {task.assignee.name}
          </span>
        </div>
      )}
    </div>
  );
} 