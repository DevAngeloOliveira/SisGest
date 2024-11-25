export type ProjectStatus = 
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ProjectRisk {
  id: string;
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  mitigation: string;
  status: 'IDENTIFIED' | 'MITIGATED' | 'CLOSED';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ProjectMetrics {
  plannedProgress: number;
  actualProgress: number;
  costVariance: number;
  scheduleVariance: number;
  taskCompletionRate: number;
  teamUtilization: number;
  riskCount: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate: Date;
  budget: {
    estimated: number;
    spent: number;
    currency: string;
    categories: Record<string, number>;
    expenses: {
      id: string;
      description: string;
      amount: number;
      category: string;
      date: Date;
    }[];
  };
  manager: TeamMember;
  team: TeamMember[];
  objectives: string[];
  deliverables: string[];
  risks: ProjectRisk[];
  milestones: {
    id: string;
    title: string;
    dueDate: Date;
    status: 'PENDING' | 'COMPLETED';
    description: string;
  }[];
  estimatedHours: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  progress: number;
  timeline: {
    start: Date;
    end: Date;
    milestones: Array<{
      date: Date;
      title: string;
    }>;
  };
  metrics: ProjectMetrics;
  qualityMetrics: Array<{
    criteria: string;
    target: number;
    actual: number;
    status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
  }>;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  team: TeamMember[];
  tags: string[];
  manager: TeamMember;
  objectives: string[];
  deliverables: string[];
  risks: ProjectRisk[];
  progress?: number;
  timeline?: {
    start: Date;
    end: Date;
    milestones: Array<{
      date: Date;
      title: string;
    }>;
  };
  metrics?: ProjectMetrics;
  qualityMetrics?: Array<{
    criteria: string;
    target: number;
    actual: number;
    status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
  }>;
} 