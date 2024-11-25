import { Task } from '../types/tasks.types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  const formattedDate = format(new Date(task.createdAt), "dd 'de' MMMM");

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 z-40"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Detalhes da Tarefa
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Título
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {task.title}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Descrição
              </h4>
              <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </h4>
              <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {task.status}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Membros
              </h4>
              <div className="mt-1 flex -space-x-2">
                {task.members.map((member) => (
                  <div
                    key={member.id}
                    className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center"
                    title={member.name}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Datas
              </h4>
              <div className="mt-1 space-y-1 text-sm text-gray-900 dark:text-white">
                <p>Início: {new Date(task.startDate).toLocaleDateString()}</p>
                <p>Término: {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Horas
              </h4>
              <div className="mt-1 space-y-1 text-sm text-gray-900 dark:text-white">
                <p>Estimadas: {task.estimatedHours}h</p>
                <p>Trabalhadas: {task.workedHours}h</p>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 