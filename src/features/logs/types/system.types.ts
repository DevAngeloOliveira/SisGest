export type SystemLogAction = 
  | 'SYSTEM_SYNC_STARTED'
  | 'SYSTEM_SYNC_COMPLETED'
  | 'SYSTEM_SYNC_ERROR'
  | 'SYSTEM_ERROR'
  | 'SYSTEM_MAINTENANCE'
  | 'SYSTEM_BACKUP';

export interface SystemLog {
  id: string;
  action: SystemLogAction;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  severity: 'INFO' | 'WARNING' | 'ERROR';
} 