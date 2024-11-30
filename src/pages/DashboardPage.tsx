import { useState, useEffect } from 'react';
import { Project, Task } from '@/types';
import { projectService } from '@/features/projects/services/projectService';
import { taskService } from '@/features/tasks/services/taskService';
import { StatCard } from '@/components/StatCard';

interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  pendingTasks: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projects, tasks] = await Promise.all([
          projectService.getProjects(),
          taskService.getTasks()
        ]);

        setStats({
          totalProjects: projects.length,
          completedProjects: projects.filter((p: Project) => p.status === 'COMPLETED').length,
          totalTasks: tasks.length,
          pendingTasks: tasks.filter((t: Task) => t.status === 'NOT_STARTED').length
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
          title="Total de Projetos"
          value={stats.totalProjects}
          icon="📊"
          color="bg-blue-500"
        />
        <StatCard
          title="Projetos Concluídos"
          value={stats.completedProjects}
          icon="✓"
          color="bg-green-500"
        />
        <StatCard
          title="Total de Tarefas"
          value={stats.totalTasks}
          icon="📝"
          color="bg-purple-500"
        />
        <StatCard
          title="Tarefas Pendentes"
          value={stats.pendingTasks}
          icon="⏳"
          color="bg-yellow-500"
        />
      </div>
    </div>
  );
} 