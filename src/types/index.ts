// Base Types
export type ID = string;

// User Types
export type UserRole = 'ADMIN' | 'MANAGER' | 'COLLABORATOR';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
}

// Project Types
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    progress: number;
    startDate: string;
    endDate?: string;
    manager: User;
    team: User[];
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

// Task Types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo?: User;
    dueDate?: string;
    estimatedHours?: number;
    completedAt?: string;
    attachments: Attachment[];
    comments: Comment[];
    subtasks: Subtask[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    createdAt: string;
    createdBy: string;
}

export interface Comment {
    id: string;
    content: string;
    author: User;
    createdAt: string;
    updatedAt?: string;
    attachments: Attachment[];
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
    assignedTo?: User;
    dueDate?: string;
    completedAt?: string;
}

// Status Colors
export const statusColors: Record<ProjectStatus, string> = {
    'NOT_STARTED': 'bg-gray-100 text-gray-800',
    'PLANNING': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
    'ON_HOLD': 'bg-orange-100 text-orange-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'ARCHIVED': 'bg-purple-100 text-purple-800'
};

export type Permission =
    | 'manage_projects'
    | 'view_projects'
    | 'manage_tasks'
    | 'update_tasks'
    | 'manage_users'
    | 'all'; 