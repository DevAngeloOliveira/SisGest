import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project } from '@/types/project.types';
import { projectService } from '../services/projectService';
import { useNotification } from '@/hooks/useNotification';
import { ProjectTeam } from '../components/ProjectTeam';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { TaskList } from '@/features/tasks/components/TaskList';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notification = useNotification();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      if (!id) return;
      const data = await projectService.getProjectById(id);
      if (!data) {
        notification.error('Projeto não encontrado');
        navigate('/projects');
        return;
      }
      setProject({
        ...data,
        tasks: [],
        timeline: {
          ...data.timeline,
          phases: []
        }
      });
    } catch {
      notification.error('Erro ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !project) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProjectTeam team={project.team} />
      <ProjectTimeline phases={project.timeline.phases} />
      <TaskList tasks={project.tasks} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
} 