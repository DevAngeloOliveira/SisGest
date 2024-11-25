import { Task } from '@/types/task.types';
import { formatDate } from '@/utils/date';
import { getStatusColor } from '@/utils/status';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
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
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Excluir
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Vence em: {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
} 