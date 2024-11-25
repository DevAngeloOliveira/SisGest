import { Log, LogAction } from '../types/log.types';
import { cacheService } from '@/services/cacheService';

class LogService {
  private getLogs(): Log[] {
    return cacheService.get('logs') || [];
  }

  private saveLogs(logs: Log[]): void {
    cacheService.set('logs', logs);
  }

  async logUserAction(
    action: LogAction,
    userId: string,
    userName: string,
    userRole: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const log: Log = {
      id: crypto.randomUUID(),
      type: action,
      entity: 'USER',
      description: `Usuário ${userName} realizou a ação: ${action}`,
      userId,
      userName,
      userRole,
      timestamp: new Date(),
      metadata,
      severity: 'INFO'
    };

    const logs = this.getLogs();
    logs.unshift(log);
    this.saveLogs(logs);
  }

  async logTaskAction(
    action: LogAction,
    taskData: Record<string, unknown>,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<void> {
    const log: Log = {
      id: crypto.randomUUID(),
      type: action,
      entity: 'TASK',
      description: this.getTaskActionDescription(action, taskData),
      userId,
      userName,
      userRole,
      timestamp: new Date(),
      metadata: taskData,
      severity: action.includes('DELETE') ? 'WARNING' : 'INFO'
    };

    const logs = this.getLogs();
    logs.unshift(log);
    this.saveLogs(logs);
  }

  private getTaskActionDescription(action: string, data: Record<string, unknown>): string {
    const taskTitle = data.title as string;
    switch (action) {
      case 'CREATED':
        return `Tarefa "${taskTitle}" foi criada`;
      case 'UPDATED':
        return `Tarefa "${taskTitle}" foi atualizada`;
      case 'DELETED':
        return `Tarefa "${taskTitle}" foi excluída`;
      case 'STATUS_CHANGED':
        return `Status da tarefa "${taskTitle}" alterado para ${data.newStatus}`;
      case 'ASSIGNED':
        return `Tarefa "${taskTitle}" atribuída para ${data.assignedTo}`;
      default:
        return `Ação ${action} realizada na tarefa "${taskTitle}"`;
    }
  }

  async exportLogs(format: 'csv' | 'json' = 'csv'): Promise<string> {
    const logs = this.getLogs();

    if (format === 'csv') {
      const headers = ['ID', 'Tipo', 'Descrição', 'Usuário', 'Papel', 'Data', 'Severidade'];
      const rows = logs.map(log => [
        log.id,
        log.type,
        log.description,
        log.userName,
        log.userRole,
        new Date(log.timestamp).toLocaleString(),
        log.severity
      ]);

      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    return JSON.stringify(logs, null, 2);
  }

  async logProjectAction(
    action: LogAction,
    projectData: Record<string, unknown>,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<void> {
    const log: Log = {
      id: crypto.randomUUID(),
      type: `PROJECT_${action}` as LogAction,
      entity: 'PROJECT',
      description: this.getProjectActionDescription(action, projectData),
      userId,
      userName,
      userRole,
      timestamp: new Date(),
      metadata: projectData,
      severity: action === 'DELETE' ? 'WARNING' : 'INFO'
    };

    const logs = this.getLogs();
    logs.unshift(log);
    this.saveLogs(logs);
  }

  private getProjectActionDescription(action: LogAction, data: Record<string, unknown>): string {
    const projectName = data.name as string;
    switch (action) {
      case 'CREATE':
        return `Projeto "${projectName}" foi criado`;
      case 'UPDATE':
        return `Projeto "${projectName}" foi atualizado`;
      case 'DELETE':
        return `Projeto "${projectName}" foi excluído`;
      case 'ARCHIVE':
        return `Projeto "${projectName}" foi arquivado`;
      default:
        return `Ação ${action} realizada no projeto "${projectName}"`;
    }
  }

  async searchLogs(filters?: LogFilter): Promise<Log[]> {
    const logs = this.getLogs();

    if (!filters) return logs;

    return logs.filter(log => {
      if (filters.action && log.type !== filters.action) return false;
      if (filters.entity && log.entity !== filters.entity) return false;
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.severity?.length && !filters.severity.includes(log.severity)) return false;
      if (filters.startDate && new Date(log.timestamp) < filters.startDate) return false;
      if (filters.endDate && new Date(log.timestamp) > filters.endDate) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          log.description.toLowerCase().includes(searchTerm) ||
          log.userName.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  }

  async getLogStats(): Promise<LogStats> {
    const logs = this.getLogs();

    const stats: LogStats = {
      total: logs.length,
      byAction: {} as Record<LogAction, number>,
      byEntity: {} as Record<LogEntity, number>,
      bySeverity: {} as Record<string, number>,
      recentActivity: []
    };

    logs.forEach(log => {
      stats.byAction[log.type] = (stats.byAction[log.type] || 0) + 1;
      stats.byEntity[log.entity] = (stats.byEntity[log.entity] || 0) + 1;
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
    });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    stats.recentActivity = last7Days.map(date => ({
      date: new Date(date),
      count: logs.filter(log =>
        log.timestamp.toISOString().split('T')[0] === date
      ).length
    }));

    return stats;
  }
}

export const logService = new LogService(); 