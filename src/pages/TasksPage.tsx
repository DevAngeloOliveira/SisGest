import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../features/tasks/types/tasks.types';
import { Project } from '../features/projects/types/projects.types';
import { taskService } from '../features/tasks/services/taskService';
import { projectService } from '../features/projects/services/projectService';
import { useNotification } from '../hooks/useNotification';
import { motion } from 'framer-motion';

export function TasksPage() {
  const [tasks, setTasks] = useState<(Task & { projectName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const notification = useNotification();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const projects = await projectService.getProjects();
      const projectsMap = new Map<string, Project>();
      projects.forEach(project => projectsMap.set(project.id, project));

      const allTasks: Task[] = [];
      for (const project of projects) {
        const projectTasks = await taskService.getTasksByProjectId(project.id);
        allTasks.push(...projectTasks);
      }

      // Adiciona o nome do projeto a cada tarefa
      const tasksWithProject = allTasks.map(task => ({
        ...task,
        projectName: projectsMap.get(task.projectId)?.name || 'Projeto Desconhecido'
      }));

      setTasks(tasksWithProject);
    } catch (error) {
      notification.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      'TODO': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'IN_REVIEW': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'BLOCKED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'COMPLETED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      'LOW': 'text-green-600 dark:text-green-400',
      'MEDIUM': 'text-yellow-600 dark:text-yellow-400',
      'HIGH': 'text-orange-600 dark:text-orange-400',
      'URGENT': 'text-red-600 dark:text-red-400'
    };
    return colors[priority];
  };

  const getStatusLabel = (status: Task['status']) => {
    const labels = {
      'TODO': 'A Fazer',
      'IN_PROGRESS': 'Em Andamento',
      'IN_REVIEW': 'Em Revisão',
      'BLOCKED': 'Bloqueada',
      'COMPLETED': 'Concluída'
    };
    return labels[status];
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.projectName?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Minhas Tarefas
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {filteredTasks.length} tarefa(s) encontrada(s)
        </p>
      </div>

      {/* Filtros */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tarefas..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Task['status'] | 'all')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">Todos</option>
            <option value="TODO">A Fazer</option>
            <option value="IN_PROGRESS">Em Andamento</option>
            <option value="IN_REVIEW">Em Revisão</option>
            <option value="BLOCKED">Bloqueada</option>
            <option value="COMPLETED">Concluída</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prioridade
          </label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Task['priority'] | 'all')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">Todas</option>
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Nenhuma tarefa encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tente ajustar os filtros ou criar uma nova tarefa.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Link 
                    to={`/projects/${task.projectId}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {task.projectName}
                  </Link>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {task.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                  <div className={`flex items-center ${getPriorityColor(task.priority)}`}>
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {task.priority}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Prazo: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {task.members.map((member) => (
                    <div
                      key={member.id}
                      className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center"
                      title={member.name}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
} 