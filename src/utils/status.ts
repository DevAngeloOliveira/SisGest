import { ProjectStatus } from '@/types/project.types';
import { TaskStatus } from '@/types/task.types';

type StatusType = ProjectStatus | TaskStatus;

const STATUS_COLORS = {
  // Project Status Colors
  PLANNING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  ON_HOLD: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  
  // Task Status Colors
  TODO: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  IN_REVIEW: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  DONE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  BLOCKED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
} as const;

export const getStatusColor = (status: StatusType): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.IN_PROGRESS;
}; 