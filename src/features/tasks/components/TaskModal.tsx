import { Task, TaskFormData } from '@/types/task.types';
import { TaskForm } from './TaskForm';

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  onSave: (data: TaskFormData) => Promise<void>;
}

export function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const taskFormData: Partial<TaskFormData> = task ? {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    projectId: task.projectId,
    assignedTo: task.assignedTo,
    dueDate: task.dueDate,
    estimatedHours: task.estimatedHours,
    tags: task.tags
  } : {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {task ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h3>
            <div className="mt-2">
              <TaskForm
                initialData={taskFormData}
                onSubmit={onSave}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 