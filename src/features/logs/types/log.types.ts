export type LogAction = 
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_PASSWORD_CHANGE'
  | 'USER_PROFILE_UPDATE'
  | 'PROJECT_CREATE'
  | 'PROJECT_UPDATE'
  | 'PROJECT_DELETE'
  | 'PROJECT_ARCHIVE'
  | 'TASK_CREATE'
  | 'TASK_UPDATE'
  | 'TASK_DELETE'
  | 'TASK_STATUS_CHANGE'
  | 'TASK_ASSIGN'
  | 'SYSTEM_SYNC_START'
  | 'SYSTEM_SYNC_COMPLETE'
  | 'SYSTEM_ERROR'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ARCHIVE';

export type LogEntity = 'USER' | 'PROJECT' | 'TASK' | 'SYSTEM';

export interface Log {
  id: string;
  type: LogAction;
  entity: LogEntity;
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface LogFilter {
  action?: LogAction;
  entity?: LogEntity;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  severity?: ('INFO' | 'WARNING' | 'ERROR')[];
  search?: string;
}

export interface LogStats {
  total: number;
  byAction: Record<LogAction, number>;
  byEntity: Record<LogEntity, number>;
  bySeverity: Record<string, number>;
  recentActivity: {
    date: Date;
    count: number;
  }[];
} 