import { ProjectStatus, ProjectPriority } from '@/features/projects/types/project.types';
import { TaskStatus, TaskPriority } from '@/types/task.types';

export const STATUS_COLORS: Record<ProjectStatus | TaskStatus, string> = {
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
};

export const PRIORITY_COLORS: Record<ProjectPriority | TaskPriority, string> = {
  LOW: 'text-green-600 dark:text-green-400',
  MEDIUM: 'text-yellow-600 dark:text-yellow-400',
  HIGH: 'text-orange-600 dark:text-orange-400',
  URGENT: 'text-red-600 dark:text-red-400'
};

export const STATUS_LABELS: Record<ProjectStatus | TaskStatus, string> = {
  PLANNING: 'Planejamento',
  IN_PROGRESS: 'Em Andamento',
  ON_HOLD: 'Em Espera',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  ARCHIVED: 'Arquivado',
  TODO: 'A Fazer',
  IN_REVIEW: 'Em Revisão',
  DONE: 'Concluído',
  BLOCKED: 'Bloqueado'
};

export const PRIORITY_LABELS: Record<ProjectPriority | TaskPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente'
}; 