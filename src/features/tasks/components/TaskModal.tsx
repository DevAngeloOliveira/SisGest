import { Task, TaskFormData } from '../types/tasks.types';
import { motion } from 'framer-motion';
import { TaskForm } from './TaskForm';
import { TeamMember } from '../../projects/types/projects.types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  projectId: string;
  availableMembers: TeamMember[];
}

export function TaskModal({ isOpen, onClose, onSubmit, projectId, task, availableMembers }: TaskModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (taskData: TaskFormData) => {
    try {
      await onSubmit(taskData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Fechar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <TaskForm
            projectId={projectId}
            task={task}
            onSubmit={handleSubmit}
            onCancel={onClose}
            availableMembers={availableMembers}
          />
        </motion.div>
      </div>
    </motion.div>
  );
} 