import { v4 } from 'uuid';
import { SyncLog, OperationType, ResourceType } from '../types/sync.types';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SyncDB extends DBSchema {
    syncLogs: {
        key: string;
        value: SyncLog;
        indexes: {
            'by-status': string;
            'by-timestamp': Date;
        };
    };
}

class SyncLogService {
    private static instance: SyncLogService;
    private db: IDBPDatabase<SyncDB> | null = null;

    private constructor() {
        this.initDB();
    }

    static getInstance(): SyncLogService {
        if (!SyncLogService.instance) {
            SyncLogService.instance = new SyncLogService();
        }
        return SyncLogService.instance;
    }

    private async initDB() {
        try {
            this.db = await openDB<SyncDB>('sync-db', 1, {
                upgrade(db) {
                    const store = db.createObjectStore('syncLogs', { keyPath: 'id' });
                    store.createIndex('by-status', 'status');
                    store.createIndex('by-timestamp', 'timestamp');
                },
            });
        } catch (error) {
            console.error('Error initializing sync database:', error);
        }
    }

    async addLog(
        operation: OperationType,
        resourceType: ResourceType,
        data: any,
        resourceId?: string
    ): Promise<SyncLog> {
        await this.ensureDB();

        const log: SyncLog = {
            id: v4(),
            timestamp: new Date(),
            operation,
            resourceType,
            resourceId,
            data,
            status: 'PENDING',
            retryCount: 0,
        };

        await this.db!.add('syncLogs', log);
        return log;
    }

    async getPendingLogs(): Promise<SyncLog[]> {
        await this.ensureDB();
        return this.db!.getAllFromIndex('syncLogs', 'by-status', 'PENDING');
    }

    async updateLogStatus(
        id: string,
        status: SyncLog['status'],
        error?: string
    ): Promise<void> {
        await this.ensureDB();
        const log = await this.db!.get('syncLogs', id);
        if (log) {
            log.status = status;
            log.error = error;
            if (status === 'FAILED') {
                log.retryCount += 1;
            }
            await this.db!.put('syncLogs', log);
        }
    }

    async clearCompletedLogs(): Promise<void> {
        await this.ensureDB();
        const tx = this.db!.transaction('syncLogs', 'readwrite');
        const completed = await tx.store.index('by-status').getAllKeys('COMPLETED');
        await Promise.all(completed.map(key => tx.store.delete(key)));
        await tx.done;
    }

    async clearAllLogs(): Promise<void> {
        await this.ensureDB();
        if (this.db) {
            const tx = this.db.transaction('syncLogs', 'readwrite');
            await tx.store.clear();
            await tx.done;
        }
    }

    private async ensureDB(): Promise<void> {
        if (!this.db) {
            await this.initDB();
            if (!this.db) {
                throw new Error('Failed to initialize database');
            }
        }
    }
}

export const syncLogService = SyncLogService.getInstance(); 