import { useState, useEffect } from 'react';
import { Log, LogAction, LogEntity } from '@/features/logs/types/log.types';
import { logService } from '@/features/logs/services/logService';
import { format } from 'date-fns';

interface LogStats {
  total: number;
  byAction: Record<LogAction, number>;
  byEntity: Record<LogEntity, number>;
  bySeverity: Record<string, number>;
  recentActivity: { date: Date; count: number; }[];
}

export function LogsPage() {
  const [currentLogs, setCurrentLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
    loadStats();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await logService.searchLogs();
      setCurrentLogs(data);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await logService.getLogStats();
      setStats({
        total: data.total,
        byAction: data.byAction,
        bySeverity: data.bySeverity,
        recentActivity: data.recentActivity,
        byEntity: data.byEntity
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total de Logs
            </h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
              {stats.total}
            </p>
          </div>
          {/* ... outras estatísticas ... */}
        </div>
      )}

      {/* Lista de Logs */}
      <div className="mt-4">
        {currentLogs.map(log => (
          <div key={log.id}>
            {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss")}
          </div>
        ))}
      </div>
    </div>
  );
} 