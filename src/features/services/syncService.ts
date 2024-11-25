import { logService } from '@/features/logs/services/logService';
import { projectService } from '@/features/projects/services/projectService';

class SyncService {
  private isSyncing = false;

  async syncAll(): Promise<void> {
    if (this.isSyncing) return;

    try {
      this.isSyncing = true;

      await logService.logUserAction(
        'SYSTEM_SYNC_START',
        'system',
        'System',
        'SYSTEM',
        { action: 'sync_started' }
      );

      // Sincroniza projetos
      await projectService.syncProjects();

      await logService.logUserAction(
        'SYSTEM_SYNC_COMPLETE',
        'system',
        'System',
        'SYSTEM',
        { action: 'sync_completed' }
      );
    } catch (error) {
      await logService.logUserAction(
        'SYSTEM_ERROR',
        'system',
        'System',
        'SYSTEM',
        { 
          action: 'sync_error',
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      );
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }
}

export const syncService = new SyncService(); 