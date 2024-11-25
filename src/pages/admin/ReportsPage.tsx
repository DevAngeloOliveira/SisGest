import { useState, useEffect } from 'react';
import { Log, LogAction, LogEntity } from '@/features/logs/types/log.types';
import { logService } from '@/features/logs/services/logService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LogFilters {
  action: LogAction | '';
  entity: LogEntity | '';
  startDate: string;
  endDate: string;
  search: string;
}

export function ReportsPage() {
  const [currentLogs, setCurrentLogs] = useState<Log[]>([]);
  const [filters, setFilters] = useState<LogFilters>({
    action: '',
    entity: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    try {
      const filteredLogs = await logService.searchLogs({
        action: filters.action || undefined,
        entity: filters.entity || undefined,
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
        search: filters.search || undefined
      });

      setCurrentLogs(filteredLogs);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const handleFilterChange = (name: keyof LogFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatLogDate = (date: Date) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss", { locale: ptBR });
  };

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          value={filters.action}
          onChange={(e) => handleFilterChange('action', e.target.value)}
          className="form-select"
        >
          <option value="">Todas as ações</option>
          {/* Opções de ação */}
        </select>
        {/* Outros filtros */}
      </div>

      {/* Lista de Logs */}
      <div className="mt-4">
        {currentLogs.map(log => (
          <div key={log.id} className="mb-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {log.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatLogDate(log.timestamp)}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                log.severity === 'ERROR' ? 'bg-red-100 text-red-800' :
                log.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {log.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 