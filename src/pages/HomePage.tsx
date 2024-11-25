import { useState, useEffect } from 'react';
import { Project } from '@/features/projects/types/project.types';
import { Task } from '@/types/task.types';
import { projectService } from '@/features/projects/services/projectService';
import { taskService } from '@/features/tasks/services/taskService';
import { useNotification } from '@/hooks/useNotification';
import { StatsCard } from '@/components/shared/StatsCard';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { formatCurrency } from '@/utils/format';

export function HomePage() {
  const notification = useNotification();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
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

      const projectsWithDefaults = projects.map(project => ({
        ...project,
        tasks: [],
        timeline: {
          ...project.timeline,
          phases: []
        }
      }));

      setRecentProjects(projectsWithDefaults.slice(0, 5));
      setPendingTasks(tasks.filter(task => task.status === 'TODO').slice(0, 5));

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
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

      {/* Recent Projects */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Projetos Recentes
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Tarefas Pendentes
        </h2>
        <div className="mt-4 space-y-4">
          {pendingTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 