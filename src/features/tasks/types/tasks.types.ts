export type TaskStatus = 
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'BLOCKED'
  | 'COMPLETED';

export type TaskPriority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export type TaskLogType = 
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'STATUS_CHANGED'
  | 'ASSIGNED'
  | 'COMMENT_ADDED';

export interface TaskMember {
  id: string;
  name: string;
  role: string;
  assignedAt: Date;
  workHours?: number;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  attachments: TaskAttachment[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  members: TaskMember[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  dueDate: Date;
  completedAt?: Date;
  estimatedHours: number;
  workedHours: number;
  tags: string[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  members: TaskMember[];
  startDate: Date;
  dueDate: Date;
  estimatedHours: number;
  workedHours: number;
  tags: string[];
  projectId: string;
}

export interface ReportFormData {
  conclusion: string;
  challenges: string;
  solutions: string;
  nextSteps: string;
  recommendations: string;
}