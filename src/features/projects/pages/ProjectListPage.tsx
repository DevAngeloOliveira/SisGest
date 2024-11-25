import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '../types/projects.types';
import { projectService } from '../services/projectService';
import { useNotification } from '../../../hooks/useNotification';
import { useConfirm } from '../../../hooks/useConfirm';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';

interface StatusColors {
  badge: string;
  icon: string;
}

export function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const notification = useNotification();
  const confirm = useConfirm();
  const { user } = useAuth();
  const { can } = usePermissions();

  // Verifica se o usuário pode criar projetos
  const canCreateProject = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch {
      notification.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const confirmed = await confirm.confirm({
        title: 'Excluir Projeto',
        message: 'Tem certeza que deseja excluir este projeto?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'danger'
      });

      if (confirmed) {
        await projectService.deleteProject(projectId);
        notification.success('Projeto excluído com sucesso');
        loadProjects();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir projeto';
      notification.error(errorMessage);
    }
  };

  const getStatusColor = (status: ProjectStatus): StatusColors => {
    const colors: Record<ProjectStatus, StatusColors> = {
      'PLANNING': {
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        icon: 'text-purple-500 dark:text-purple-400'
      },
      'IN_PROGRESS': {
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        icon: 'text-blue-500 dark:text-blue-400'
      },
      'ON_HOLD': {
        badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: 'text-yellow-500 dark:text-yellow-400'
      },
      'COMPLETED': {
        badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: 'text-green-500 dark:text-green-400'
      },
      'CANCELLED': {
        badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: 'text-red-500 dark:text-red-400'
      },
      'ARCHIVED': {
        badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        icon: 'text-gray-500 dark:text-gray-400'
      }
    };
    return colors[status];
  };

  const getStatusIcon = (status: ProjectStatus) => {
    const icons: Record<ProjectStatus, JSX.Element> = {
      'PLANNING': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      'IN_PROGRESS': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'ON_HOLD': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'COMPLETED': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'CANCELLED': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'ARCHIVED': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    };
    return icons[status];
  };

  const getStatusLabel = (status: ProjectStatus): string => {
    const labels: Record<ProjectStatus, string> = {
      'PLANNING': 'Planejamento',
      'IN_PROGRESS': 'Em Andamento',
      'ON_HOLD': 'Em Espera',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado',
      'ARCHIVED': 'Arquivado'
    };
    return labels[status] || status;
  };

  const filteredProjects = projects
    .filter(project => {
      if (filterStatus === 'all') return true;
      return project.status === filterStatus;
    })
    .filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projetos</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filteredProjects.length} projeto(s) encontrado(s)
          </p>
        </div>
        {canCreateProject && (
          <Link
            to="/projects/new"
            className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo Projeto</span>
          </Link>
        )}
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center w-full space-x-4 sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">Todos os Status</option>
            <option value="PLANNING">Planejamento</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="ON_HOLD">Em Pausa</option>
            <option value="COMPLETED">Concluído</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de Projetos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}
        >
          {filteredProjects.length === 0 ? (
            <div className="py-12 text-center col-span-full">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
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
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                  >
                    <svg
                      className="w-5 h-5 mr-2 -ml-1"
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
            filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'p-6' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <Link to={`/projects/${project.id}`} className="flex-1">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center ml-4 space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status).badge}`}>
                        <span className={`mr-1.5 ${getStatusColor(project.status).icon}`}>
                          {getStatusIcon(project.status)}
                        </span>
                        {getStatusLabel(project.status)}
                      </span>
                      {(can('delete_project') || project.manager === user?.id) && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteProject(project.id);
                          }}
                          className="p-1 text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                          title="Excluir Projeto"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progresso
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="h-full transition-all duration-300 bg-blue-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800"
                        >
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            +{project.team.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 