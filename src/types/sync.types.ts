export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE';
export type ResourceType = 'USER' | 'PROJECT' | 'TASK' | 'COMMENT';

export interface SyncLog {
    id: string;
    timestamp: Date;
    operation: OperationType;
    resourceType: ResourceType;
    resourceId?: string;
    data: any;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    retryCount: number;
    error?: string;
}

export interface SyncState {
    lastSync: Date | null;
    isSyncing: boolean;
    pendingLogs: number;
    hasError: boolean;
} 