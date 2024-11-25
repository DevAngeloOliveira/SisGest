export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
  estimatedHours?: number;
  completedAt?: Date;
  comments: {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
  }[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
  estimatedHours?: number;
  tags: string[];
} 