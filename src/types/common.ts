export type Permission =
    | 'all'
    | 'manage_projects'
    | 'view_projects'
    | 'manage_tasks'
    | 'update_tasks'
    | 'admin'
    | 'edit'
    | 'view'
    | 'delete';

export type ProjectStatus =
    | 'NOT_STARTED'
    | 'PLANNING'
    | 'IN_PROGRESS'
    | 'ON_HOLD'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'ARCHIVED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'MANAGER' | 'COLLABORATOR';
    permissions: Permission[];
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    skills: string[];
    availability: number;
}

export interface TimelinePhase {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    progress: number;
}

export interface Timeline {
    phases: TimelinePhase[];
    start: Date;
    end: Date;
    milestones: { date: Date; title: string; }[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    priority: Priority;
    startDate: string;
    endDate: string;
    progress: number;
    team: TeamMember[];
    timeline: Timeline;
    tasks: Task[];
    manager: TeamMember;
    objectives: string[];
    deliverables: string[];
    risks: { description: string; impact: string; mitigation: string; }[];
    budget: number;
    metrics?: {
        costVariance: number;
        scheduleVariance: number;
        qualityScore: number;
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: ProjectStatus;
    priority: Priority;
    assignee: TeamMember;
    startDate: string;
    endDate: string;
    progress: number;
    estimatedHours: number;
    actualHours: number;
    dependencies: string[];
    attachments: { name: string; url: string; }[];
    comments: { id: string; text: string; author: string; createdAt: string; }[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export const statusColors: Record<ProjectStatus, string> = {
    'NOT_STARTED': 'bg-gray-100 text-gray-800',
    'PLANNING': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
    'ON_HOLD': 'bg-orange-100 text-orange-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'ARCHIVED': 'bg-purple-100 text-purple-800'
}; 