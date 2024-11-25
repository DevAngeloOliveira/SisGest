import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Project } from '../features/projects/types/projects.types';
import { projectService } from '../features/projects/services/projectService';
import { useNotification } from '../hooks/useNotification';
import { TaskList } from '../features/tasks/components/TaskList';
import { ProjectTimeline } from '../features/projects/components/ProjectTimeline';
import { ProjectTeam } from '../features/projects/components/ProjectTeam';
import { ProjectStats } from '../features/projects/components/ProjectStats';
import { ProjectComments } from '../features/projects/components/ProjectComments';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notification = useNotification();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'timeline' | 'team' | 'comments'>('overview');

  useEffect(() => {
    if (id) {
      const projectData = projectService.getProjectById(id);
      if (projectData) {
        setProject(projectData);
      } else {
        notification.error('Projeto não encontrado');
        navigate('/projects');
      }
    }
  }, [id, navigate, notification]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(`/projects/${id}/edit`)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Editar Projeto
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-8">
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'tasks', label: 'Tarefas' },
            { key: 'timeline', label: 'Timeline' },
            { key: 'team', label: 'Equipe' },
            { key: 'comments', label: 'Comentários' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProjectStats project={project} />
            <ProjectTeam project={project} />
          </div>
        )}

        {activeTab === 'tasks' && (
          <TaskList projectId={project.id} />
        )}

        {activeTab === 'timeline' && (
          <ProjectTimeline project={project} />
        )}

        {activeTab === 'team' && (
          <ProjectTeam project={project} showAll />
        )}

        {activeTab === 'comments' && (
          <ProjectComments projectId={project.id} />
        )}
      </motion.div>
    </div>
  );
} 