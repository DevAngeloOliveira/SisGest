export interface TimelinePhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  tasks: string[]; // IDs das tarefas
}

export interface TimelineMilestone {
  date: Date;
  title: string;
}

export interface Timeline {
  phases: TimelinePhase[];
  start: Date;
  end: Date;
  milestones: TimelineMilestone[];
} 