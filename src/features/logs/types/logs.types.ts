export type LogType = 
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_DELETED'
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'TASK_STATUS_CHANGED'
  | 'TASK_ASSIGNED'
  | 'TASK_COMMENT_ADDED'
  | 'SYSTEM_ERROR'
  | 'SYNC_STARTED'
  | 'SYNC_COMPLETED'
  | 'SYNC_ERROR';

export interface Log {
  id: string;
  type: LogType;
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export interface SystemLog extends Log {
  ip?: string;
  userAgent?: string;
}

export interface LogAction {
  type: LogType;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface LogEntity {
  id: string;
  name: string;
  type: string;
} 