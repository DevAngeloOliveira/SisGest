import { useState } from 'react';
import { Task } from '@/types/task.types';
import { generateTaskReport, exportTasksToCSV } from '../services/reportService';

interface TaskReportProps {
  tasks: Task[];
}

export function TaskReport({ tasks }: TaskReportProps) {
  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);
      const blob = await generateTaskReport(tasks);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tarefas-${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      const csv = await exportTasksToCSV(tasks);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tarefas-${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleGeneratePDF}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Gerando...' : 'Gerar PDF'}
      </button>
      <button
        onClick={handleExportCSV}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Exportando...' : 'Exportar CSV'}
      </button>
    </div>
  );
} 