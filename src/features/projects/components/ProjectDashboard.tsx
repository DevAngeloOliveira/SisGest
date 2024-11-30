import { Project } from '@/types';
import { Chart } from '@/components/Chart';

interface ProjectDashboardProps {
  project: Project;
}

export function ProjectDashboard({ project }: ProjectDashboardProps) {
  const taskStatusData = [
    {
      name: 'Não Iniciadas',
      value: project.tasks.filter(t => t.status === 'NOT_STARTED').length,
      color: 'bg-gray-100'
    },
    {
      name: 'Em Progresso',
      value: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      color: 'bg-blue-100'
    },
    {
      name: 'Concluídas',
      value: project.tasks.filter(t => t.status === 'COMPLETED').length,
      color: 'bg-green-100'
    }
  ];

  const taskPriorityData = [
    {
      name: 'Baixa',
      value: project.tasks.filter(t => t.priority === 'LOW').length,
      color: 'bg-green-100'
    },
    {
      name: 'Média',
      value: project.tasks.filter(t => t.priority === 'MEDIUM').length,
      color: 'bg-yellow-100'
    },
    {
      name: 'Alta',
      value: project.tasks.filter(t => t.priority === 'HIGH').length,
      color: 'bg-orange-100'
    },
    {
      name: 'Crítica',
      value: project.tasks.filter(t => t.priority === 'CRITICAL').length,
      color: 'bg-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Status das Tarefas</h3>
        <Chart data={taskStatusData} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Prioridade das Tarefas</h3>
        <Chart data={taskPriorityData} />
      </div>
    </div>
  );
} 