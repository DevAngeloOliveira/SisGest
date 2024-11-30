import { useState, useEffect } from 'react';
import { Project, Task } from '@/types';
import { projectService } from '../services/projectService';
import { taskService } from '@/features/tasks/services/taskService';
import { StatCard } from '@/components/StatCard';

interface DashboardStats {
  completedProjects: number;
  inProgressProjects: number;
  pendingTasks: number;
  totalBudget: number;
}

export function HomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    completedProjects: 0,
    inProgressProjects: 0,
    pendingTasks: 0,
    totalBudget: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projects, tasks] = await Promise.all([
          projectService.getProjects(),
          taskService.getTasks()
        ]);

        setStats({
          completedProjects: projects.filter((p: Project) => p.status === 'COMPLETED').length,
          inProgressProjects: projects.filter((p: Project) => p.status === 'IN_PROGRESS').length,
          pendingTasks: tasks.filter((t: Task) => t.status === 'NOT_STARTED').length,
          totalBudget: projects.reduce((acc: number, p: Project) => acc + (p.budget?.estimated || 0), 0)
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projetos Concluídos"
          value={stats.completedProjects}
          icon="✓"
          color="bg-green-500"
        />
        <StatCard
          title="Projetos em Andamento"
          value={stats.inProgressProjects}
          icon="⚡"
          color="bg-blue-500"
        />
        <StatCard
          title="Tarefas Pendentes"
          value={stats.pendingTasks}
          icon="⏳"
          color="bg-yellow-500"
        />
        <StatCard
          title="Orçamento Total"
          value={`R$ ${stats.totalBudget.toLocaleString()}`}
          icon="💰"
          color="bg-purple-500"
        />
      </div>
    </div>
  );
} 