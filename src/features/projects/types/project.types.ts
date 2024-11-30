import { ID, Priority, ProjectStatus, TeamMember, Timeline, Task } from '@/types';

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  endDate: string;
  team: TeamMember[];
  timeline: Timeline;
  manager: TeamMember;
  objectives: string[];
  deliverables: string[];
  risks: { description: string; impact: string; mitigation: string; }[];
  budget: {
    estimated: number;
    actual: number;
    variance: number;
  };
}

export interface Project {
  id: ID;
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
  budget: {
    estimated: number;
    actual: number;
    variance: number;
  };
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