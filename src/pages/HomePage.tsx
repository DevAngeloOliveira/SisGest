import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '../features/projects/types/projects.types';
import { Task } from '../features/tasks/types/tasks.types';
import { projectService } from '../features/projects/services/projectService';
import { taskService } from '../features/tasks/services/taskService';
import { useAuth } from '../features/auth/hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { motion } from 'framer-motion';

export function HomePage() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const projects = await projectService.getProjects();
      const tasks = await taskService.getTasksByProjectId('all'); // Implementar na taskService

      setRecentProjects(projects.slice(0, 5));
      setPendingTasks(tasks.filter(task => task.status === 'pending').slice(0, 5));
      
      setStats({
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        inProgressProjects: projects.filter(p => p.status === 'in_progress').length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    const colors = {
      'PLANNING': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'ON_HOLD': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels = {
      'PLANNING': 'Planejamento',
      'IN_PROGRESS': 'Em Progresso',
      'ON_HOLD': 'Em Pausa',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado'
    };
    return labels[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'LOW': 'text-green-600 dark:text-green-400',
      'MEDIUM': 'text-yellow-600 dark:text-yellow-400',
      'HIGH': 'text-orange-600 dark:text-orange-400',
      'URGENT': 'text-red-600 dark:text-red-400'
    };
    return colors[priority] || 'text-gray-600 dark:text-gray-400';
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      'LOW': 'Baixa',
      'MEDIUM': 'Média',
      'HIGH': 'Alta',
      'URGENT': 'Urgente'
    };
    return labels[priority] || priority;
  };

  // Verifica se o usuário pode criar projetos
  const canCreateProject = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aqui está um resumo das suas atividades
          </p>
        </div>
        {canCreateProject && (
          <Link
            to="/projects/new"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Novo Projeto
          </Link>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Projetos</h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/30">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Projetos Concluídos</h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completedProjects}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900/30">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Progresso</h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inProgressProjects}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/30">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tarefas Pendentes</h2>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projetos Recentes e Tarefas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projetos Recentes */}
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Projetos Recentes</h2>
              <Link
                to="/projects"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Ver todos
              </Link>
            </div>
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nenhum projeto encontrado
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {canCreateProject 
                      ? 'Comece criando um novo projeto.'
                      : 'Você ainda não foi adicionado a nenhum projeto.'}
                  </p>
                  {canCreateProject && (
                    <div className="mt-6">
                      <Link
                        to="/projects/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <svg
                          className="-ml-1 mr-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Novo Projeto
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                recentProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <Link to={`/projects/${project.id}`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center ${getPriorityColor(project.priority)}`}>
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {getPriorityLabel(project.priority)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Prazo: {new Date(project.endDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member) => (
                              <div
                                key={member.id}
                                className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center"
                              >
                                {member.avatar ? (
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="h-full w-full rounded-full"
                                  />
                                ) : (
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {member.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                            ))}
                            {project.team.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  +{project.team.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Progresso</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tarefas Pendentes */}
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tarefas Pendentes</h2>
            <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingTasks.map((task) => (
                <div key={task.id} className="py-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 