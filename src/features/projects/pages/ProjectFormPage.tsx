import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectFormData } from '../types/project.types';
import { projectService } from '../services/projectService';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function ProjectFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const notification = useNotification();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    estimatedHours: 0,
    team: [],
    tags: [],
    manager: { id: '', name: '', role: '' },
    objectives: [],
    deliverables: [],
    risks: []
  });

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      if (!id) return;
      const project = await projectService.getProjectById(id);
      if (project) {
        setFormData({
          ...project,
          startDate: project.startDate,
          endDate: project.endDate,
          manager: project.manager,
          team: project.team
        });
      }
    } catch {
      notification.error('Erro ao carregar projeto');
      navigate('/projects');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        notification.error('A data de início não pode ser posterior à data de término');
        return;
      }

      if (id) {
        await projectService.updateProject(id, formData);
        notification.success('Projeto atualizado com sucesso!');
      } else {
        if (!user) {
          notification.error('Usuário não autenticado');
          return;
        }
        await projectService.createProject(formData, user.id, user.name, user.role);
        notification.success('Projeto criado com sucesso!');
      }

      navigate('/projects');
    } catch {
      notification.error('Erro ao salvar projeto');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ... campos do formulário ... */}
    </form>
  );
} 