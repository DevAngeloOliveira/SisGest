import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { taskService } from '@/features/tasks/services/taskService';
import { useNotification } from '@/hooks/useNotification';
import { StatsCard } from '@/components/shared/StatsCard';
import { formatCurrency } from '@/utils/format';

export function HomePage() {
  const notification = useNotification();
  const [stats, setStats] = useState({
    completedProjects: 0,
    inProgressProjects: 0,
    pendingTasks: 0,
    totalBudget: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [projects, tasks] = await Promise.all([
        projectService.getProjects(),
        taskService.getAllTasks()
      ]);

      setStats({
        completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
        inProgressProjects: projects.filter(p => p.status === 'IN_PROGRESS').length,
        pendingTasks: tasks.filter(t => t.status === 'TODO').length,
        totalBudget: projects.reduce((acc, p) => acc + (p.budget?.estimated || 0), 0)
      });
    } catch {
      notification.error('Erro ao carregar dados do dashboard');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Projetos Concluídos"
        value={stats.completedProjects}
      />
      <StatsCard
        title="Projetos em Andamento"
        value={stats.inProgressProjects}
      />
      <StatsCard
        title="Tarefas Pendentes"
        value={stats.pendingTasks}
      />
      <StatsCard
        title="Orçamento Total"
        value={formatCurrency(stats.totalBudget)}
      />
    </div>
  );
} 