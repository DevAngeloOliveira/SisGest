import { useState, useEffect } from 'react';
import { Project } from '@/types/project.types';
import { projectService } from '@/features/projects/services/projectService';
import { useNotification } from '@/hooks/useNotification';
import { ProjectCard } from '@/features/projects/components/ProjectCard';

export function ProjectsPage() {
  const notification = useNotification();
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setCurrentProjects(data.map(project => ({
        ...project,
        timeline: {
          ...project.timeline,
          phases: [],
          milestones: project.timeline?.milestones || []
        },
        tasks: []
      })));
    } catch {
      notification.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {currentProjects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
} 