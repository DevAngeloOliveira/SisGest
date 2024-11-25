import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project } from '@/types/project.types';
import { projectService } from '@/features/projects/services/projectService';
import { useNotification } from '@/hooks/useNotification';
import { ProjectTeam } from '@/features/projects/components/ProjectTeam';
import { ProjectTimeline } from '@/features/projects/components/ProjectTimeline';
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
    <div>
      <ProjectTeam team={project.team} />
      <ProjectTimeline phases={project.timeline.phases || []} />
      <TaskList tasks={project.tasks || []} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
} 