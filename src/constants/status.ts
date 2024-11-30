import { ProjectStatus } from '@/types';

export const statusColors: Record<ProjectStatus, string> = {
  'NOT_STARTED': 'bg-gray-100 text-gray-800',
  'PLANNING': 'bg-blue-100 text-blue-800',
  'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
  'ON_HOLD': 'bg-orange-100 text-orange-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800',
  'ARCHIVED': 'bg-purple-100 text-purple-800'
}; 