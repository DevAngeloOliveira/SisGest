import { useNavigate } from 'react-router-dom';
import { Project, ProjectFormData } from '../types/project.types';
import { ProjectFormModal } from '../components/ProjectFormModal';
import { projectService } from '../services/projectService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

interface ProjectFormPageProps {
  project?: Project;
}

export function ProjectFormPage({ project }: ProjectFormPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSave = async (formData: ProjectFormData) => {
    try {
      if (project) {
        const data: Partial<Project> = {
          ...formData,
          updatedBy: user!.id
        };
        await projectService.updateProject(project.id, data);
        toast.success('Projeto atualizado com sucesso!');
      } else {
        const data: Partial<Project> = {
          ...formData,
          createdBy: user!.id,
          updatedBy: user!.id
        };
        await projectService.createProject(data, user!.id);
        toast.success('Projeto criado com sucesso!');
      }
      navigate('/projects');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar projeto');
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <ProjectFormModal
      project={project}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
} 