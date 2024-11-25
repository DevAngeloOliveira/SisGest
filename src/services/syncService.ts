import { cacheService } from './cacheService';
import { logService } from '../features/logs/services/logService';

class SyncService {
  private syncInProgress = false;
  private lastSyncTimestamp: number | null = null;
  private syncInterval = 5 * 60 * 1000; // 5 minutos

  async syncData(userId: string, userName: string, userRole: string) {
    if (this.syncInProgress) return;
    
    try {
      this.syncInProgress = true;
      const now = Date.now();

      // Verifica se é necessário sincronizar
      if (this.lastSyncTimestamp && now - this.lastSyncTimestamp < this.syncInterval) {
        return;
      }

      // Registra início da sincronização
      await logService.createSystemLog(
        'SYNC_STARTED',
        'Iniciando sincronização de dados',
        userId,
        userName,
        userRole,
        { timestamp: now }
      );

      // Sincroniza projetos
      const projects = cacheService.get('projects') || [];
      localStorage.setItem('projects_backup', JSON.stringify(projects));

      // Sincroniza tarefas
      const tasks = cacheService.get('tasks') || [];
      localStorage.setItem('tasks_backup', JSON.stringify(tasks));

      // Sincroniza logs
      const logs = cacheService.get('logs') || [];
      localStorage.setItem('logs_backup', JSON.stringify(logs));

      this.lastSyncTimestamp = now;

      // Registra sucesso da sincronização
      await logService.createSystemLog(
        'SYNC_COMPLETED',
        'Sincronização concluída com sucesso',
        userId,
        userName,
        userRole,
        { timestamp: now }
      );
    } catch (error) {
      // Registra erro na sincronização
      await logService.createSystemLog(
        'SYNC_ERROR',
        'Erro durante a sincronização',
        userId,
        userName,
        userRole,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );

      // Tenta restaurar dados do backup
      this.restoreFromBackup();
    } finally {
      this.syncInProgress = false;
    }
  }

  private restoreFromBackup() {
    try {
      // Restaura projetos
      const projectsBackup = localStorage.getItem('projects_backup');
      if (projectsBackup) {
        cacheService.set('projects', JSON.parse(projectsBackup));
      }

      // Restaura tarefas
      const tasksBackup = localStorage.getItem('tasks_backup');
      if (tasksBackup) {
        cacheService.set('tasks', JSON.parse(tasksBackup));
      }

      // Restaura logs
      const logsBackup = localStorage.getItem('logs_backup');
      if (logsBackup) {
        cacheService.set('logs', JSON.parse(logsBackup));
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
    }
  }

  async clearSyncData() {
    localStorage.removeItem('projects_backup');
    localStorage.removeItem('tasks_backup');
    localStorage.removeItem('logs_backup');
    this.lastSyncTimestamp = null;
  }
}

export const syncService = new SyncService(); 