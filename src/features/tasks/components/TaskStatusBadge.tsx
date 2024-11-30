import { ProjectStatus } from '@/types';
import { statusColors } from '@/utils/status';

interface TaskStatusBadgeProps {
  status: ProjectStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {status}
    </span>
  );
} 