import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project } from '../types/projects.types';
import { projectService } from '../services/projectService';
import { useNotification } from '../../../hooks/useNotification';
import { ProjectDashboard } from '../components/ProjectDashboard';
import { ProjectTeam } from '../components/ProjectTeam';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { TaskList } from '../../tasks/components/TaskList';
import { ProjectComments } from '../components/ProjectComments';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import { useConfirm } from '../../../hooks/useConfirm';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notification = useNotification();
  const { user } = useAuth();
  const { can } = usePermissions();
  const confirm = useConfirm();
  
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'timeline' | 'tasks' | 'documents' | 'comments'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      if (!id) return;
      const data = await projectService.getProjectById(id);
      setProject(data);
    } catch (error) {
      notification.error('Erro ao carregar projeto');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Project['status']) => {
    try {
      if (!project) return;
      
      const updatedProject = await projectService.updateProject(project.id, {
        ...project,
        status: newStatus
      });
      
      setProject(updatedProject);
      notification.success('Status atualizado com sucesso');
    } catch (error) {
      notification.error('Erro ao atualizar status');
    }
  };

  const handleArchiveProject = async () => {
    try {
      const confirmed = await confirm({
        title: 'Arquivar Projeto',
        message: 'Tem certeza que deseja arquivar este projeto? Ele ainda poderá ser visualizado, mas não poderá ser editado.',
        confirmText: 'Arquivar',
        cancelText: 'Cancelar',
        type: 'warning'
      });

      if (confirmed && project) {
        await projectService.archiveProject(project.id);
        notification.success('Projeto arquivado com sucesso');
        navigate('/projects');
      }
    } catch (error) {
      notification.error('Erro ao arquivar projeto');
    }
  };

  const handleDeleteProject = async () => {
    try {
      const confirmed = await confirm({
        title: 'Excluir Projeto',
        message: 'Tem certeza que deseja excluir este projeto? Esta ação não poderá ser desfeita.',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'danger'
      });

      if (confirmed && project) {
        await projectService.deleteProject(project.id);
        notification.success('Projeto excluído com sucesso');
        navigate('/projects');
      }
    } catch (error: any) {
      notification.error(error.message || 'Erro ao excluir projeto');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Projeto não encontrado
        </h3>
      </div>
    );
  }

  const isProjectManager = project.manager === user?.id;
  const canEditProject = can('edit_project') || isProjectManager;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {project.description}
          </p>
        </div>
        {canEditProject && (
          <div className="flex items-center space-x-4">
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value as Project['status'])}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="PLANNING">Planejamento</option>
              <option value="IN_PROGRESS">Em Progresso</option>
              <option value="ON_HOLD">Em Pausa</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
            
            <button
              onClick={() => navigate(`/projects/${id}/edit`)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Editar Projeto
            </button>

            <button
              onClick={handleArchiveProject}
              className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
            >
              Arquivar
            </button>

            <button
              onClick={handleDeleteProject}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Navegação */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'team', label: 'Equipe' },
            { key: 'timeline', label: 'Linha do Tempo' },
            { key: 'tasks', label: 'Tarefas' },
            { key: 'documents', label: 'Documentos' },
            { key: 'comments', label: 'Comentários' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`
                border-b-2 py-4 px-1 text-sm font-medium
                ${activeTab === key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
              `}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo */}
      <div className="mt-6">
        {activeTab === 'overview' && <ProjectDashboard project={project} />}
        {activeTab === 'team' && <ProjectTeam project={project} showAll />}
        {activeTab === 'timeline' && <ProjectTimeline project={project} />}
        {activeTab === 'tasks' && <TaskList projectId={project.id} />}
        {activeTab === 'documents' && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Funcionalidade em desenvolvimento
          </div>
        )}
        {activeTab === 'comments' && <ProjectComments projectId={project.id} />}
      </div>
    </div>
  );
} 