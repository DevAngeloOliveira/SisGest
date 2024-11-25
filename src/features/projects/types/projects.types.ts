export type ProjectStatus = 
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type ProjectPriority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  workload?: number;
  skills?: string[];
  assignedTasks?: number;
  availability?: number;
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

export interface ProjectRisk {
  id: string;
  description: string;
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  mitigation: string;
  status: 'IDENTIFIED' | 'MITIGATED' | 'OCCURRED';
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'PENDING' | 'COMPLETED';
  dependencies: string[];
  deliverables: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate: Date;
  manager: string;
  team: TeamMember[];
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
  progress: number;
  objectives: string[];
  deliverables: string[];
  risks: ProjectRisk[];
  timeline: {
    phases: {
      id: string;
      title: string;
      name: string;
      startDate: Date;
      endDate: Date;
      progress: number;
      milestones: ProjectMilestone[];
    }[];
  };
  metrics: ProjectMetrics;
  qualityMetrics: QualityMetric[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate: Date;
  manager: string;
  team: TeamMember[];
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
  objectives: string[];
  deliverables: string[];
  risks: ProjectRisk[];
  estimatedHours?: number;
  tags?: string[];
  category?: string;
  progress?: number;
  notes?: string;
}

export interface QualityMetric {
  id: string;
  name: string;
  target: number;
  actual: number;
  criteria: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
} 