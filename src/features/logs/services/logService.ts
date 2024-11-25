import { Log, LogType } from '../types/logs.types';
import { cacheService } from '../../../services/cacheService';
import { CACHE_KEYS } from '../../../services/cacheService';
import { TaskLogType } from '../../tasks/types/taskLog.types';

interface SystemLogData extends Log {
  userAgent?: string;
  ip?: string;
}

class LogService {
  private getLogsFromCache(): Log[] {
    return cacheService.get<Log[]>(CACHE_KEYS.logs) || [];
  }

  private saveLogs(logs: Log[]): void {
    cacheService.set(CACHE_KEYS.logs, logs);
  }

  async createSystemLog(
    type: LogType,
    description: string,
    userId: string,
    userName: string,
    userRole: string,
    metadata?: Record<string, unknown>,
    severity: 'INFO' | 'WARNING' | 'ERROR' = 'INFO'
  ): Promise<void> {
    const log: SystemLogData = {
      id: crypto.randomUUID(),
      type,
      description,
      userId,
      userName,
      userRole,
      timestamp: new Date(),
      metadata,
      severity,
      userAgent: navigator.userAgent,
      ip: await this.getClientIP()
    };

    const logs = this.getLogsFromCache();
    logs.unshift(log);

    // Limita a quantidade de logs
    const maxLogs = 10000;
    if (logs.length > maxLogs) {
      logs.splice(maxLogs);
    }

    this.saveLogs(logs);
  }

  // Função auxiliar para obter IP do cliente
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  // Métodos específicos para diferentes tipos de logs
  async logUserAction(
    action: 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'PROFILE_UPDATE',
    userId: string,
    userName: string,
    userRole: string,
    metadata?: Record<string, unknown>
  ) {
    const type = `USER_${action}` as LogType;
    return this.createSystemLog(
      type,
      `Usuário ${userName} realizou a ação: ${action.toLowerCase()}`,
      userId,
      userName,
      userRole,
      metadata,
      'INFO'
    );
  }

  async logProjectAction(
    action: 'CREATED' | 'UPDATED' | 'DELETED' | 'ARCHIVED' | 'STATUS_CHANGED',
    projectData: Record<string, unknown>,
    userId: string,
    userName: string,
    userRole: string
  ) {
    const type = `PROJECT_${action}` as LogType;
    const description = this.getProjectActionDescription(action, projectData);
    return this.createSystemLog(
      type,
      description,
      userId,
      userName,
      userRole,
      projectData,
      action === 'DELETED' ? 'WARNING' : 'INFO'
    );
  }

  async logTaskAction(
    type: TaskLogType,
    data: Record<string, unknown>,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<void> {
    let description = '';
    
    switch (type) {
      case 'TASK_CREATED':
        description = `Tarefa "${data.taskTitle}" foi criada`;
        break;
      case 'TASK_UPDATED':
        description = `Tarefa "${data.taskTitle}" foi atualizada`;
        break;
      case 'TASK_DELETED':
        description = `Tarefa "${data.taskTitle}" foi excluída`;
        break;
      case 'TASK_STATUS_CHANGED':
        description = `Status da tarefa "${data.taskTitle}" alterado para ${data.newStatus}`;
        break;
      case 'TASK_ASSIGNED':
        description = `Tarefa "${data.taskTitle}" atribuída para ${data.assignedTo}`;
        break;
      case 'TASK_COMMENT_ADDED':
        description = `Novo comentário adicionado à tarefa "${data.taskTitle}"`;
        break;
      default:
        description = `Ação ${type} realizada na tarefa "${data.taskTitle}"`;
    }

    await this.createSystemLog(
      type as LogType,
      description,
      userId,
      userName,
      userRole,
      data,
      'INFO'
    );
  }

  async logTeamAction(
    action: 'MEMBER_ADDED' | 'MEMBER_REMOVED' | 'ROLE_CHANGED',
    teamData: Record<string, unknown>,
    userId: string,
    userName: string,
    userRole: string
  ) {
    const type = `TEAM_${action}` as LogType;
    const description = this.getTeamActionDescription(action, teamData);
    return this.createSystemLog(
      type,
      description,
      userId,
      userName,
      userRole,
      teamData,
      'INFO'
    );
  }

  async logSystemError(
    error: Error,
    userId: string,
    userName: string,
    userRole: string,
    metadata?: Record<string, unknown>
  ) {
    return this.createSystemLog(
      'TASK_SYSTEM_ERROR' as LogType,
      error.message,
      userId,
      userName,
      userRole,
      metadata,
      'ERROR'
    );
  }

  private getProjectActionDescription(action: string, data: Record<string, unknown>): string {
    const projectName = data.name as string;
    switch (action) {
      case 'CREATED':
        return `Projeto "${projectName}" foi criado`;
      case 'UPDATED':
        return `Projeto "${projectName}" foi atualizado`;
      case 'DELETED':
        return `Projeto "${projectName}" foi excluído`;
      case 'ARCHIVED':
        return `Projeto "${projectName}" foi arquivado`;
      case 'STATUS_CHANGED':
        return `Status do projeto "${projectName}" alterado para ${data.newStatus}`;
      default:
        return `Ação ${action} realizada no projeto "${projectName}"`;
    }
  }

  private getTeamActionDescription(action: string, data: Record<string, unknown>): string {
    const memberName = data.memberName as string;
    const projectName = data.projectName as string;
    switch (action) {
      case 'MEMBER_ADDED':
        return `${memberName} foi adicionado à equipe do projeto "${projectName}"`;
      case 'MEMBER_REMOVED':
        return `${memberName} foi removido da equipe do projeto "${projectName}"`;
      case 'ROLE_CHANGED':
        return `Papel de ${memberName} alterado para ${data.newRole}`;
      default:
        return `Ação ${action} realizada na equipe`;
    }
  }

  async searchLogs(filters?: {
    type?: LogType[];
    userId?: string;
    severity?: ('INFO' | 'WARNING' | 'ERROR')[];
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }): Promise<Log[]> {
    let logs = this.getLogsFromCache();

    if (filters) {
      logs = logs.filter(log => {
        if (filters.type?.length && !filters.type.includes(log.type)) {
          return false;
        }
        if (filters.userId && log.userId !== filters.userId) {
          return false;
        }
        if (filters.severity?.length && !filters.severity.includes(log.severity)) {
          return false;
        }
        if (filters.startDate && new Date(log.timestamp) < filters.startDate) {
          return false;
        }
        if (filters.endDate && new Date(log.timestamp) > filters.endDate) {
          return false;
        }
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          return (
            log.description.toLowerCase().includes(searchTerm) ||
            log.userName.toLowerCase().includes(searchTerm) ||
            log.type.toLowerCase().includes(searchTerm)
          );
        }
        return true;
      });
    }

    return logs;
  }

  async clearLogs(): Promise<void> {
    this.saveLogs([]);
  }

  async exportLogs(format: 'csv' | 'json' = 'csv'): Promise<string> {
    const logs = this.getLogsFromCache();

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

  async getLogStats(): Promise<{
    total: number;
    byType: Record<LogType, number>;
    bySeverity: Record<string, number>;
    recentActivity: { date: Date; count: number; }[];
  }> {
    const logs = this.getLogsFromCache();
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const recentActivity: Record<string, number> = {};

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    logs.forEach(log => {
      byType[log.type] = (byType[log.type] || 0) + 1;
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;

      const date = new Date(log.timestamp).toISOString().split('T')[0];
      if (last7Days.includes(date)) {
        recentActivity[date] = (recentActivity[date] || 0) + 1;
      }
    });

    return {
      total: logs.length,
      byType: byType as Record<LogType, number>,
      bySeverity,
      recentActivity: last7Days.map(date => ({
        date: new Date(date),
        count: recentActivity[date] || 0
      }))
    };
  }
}

export const logService = new LogService(); 