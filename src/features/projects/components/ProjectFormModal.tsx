import { Project, ProjectFormData } from '../types/project.types';
import { useForm } from 'react-hook-form';

interface ProjectFormModalProps {
  project?: Project;
  onSave: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProjectFormModal({ project, onSave, onCancel }: ProjectFormModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: project ? {
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      team: project.team,
      timeline: project.timeline,
      manager: project.manager,
      objectives: project.objectives,
      deliverables: project.deliverables,
      risks: project.risks,
      budget: {
        estimated: project.budget.estimated,
        actual: project.budget.actual,
        variance: project.budget.variance
      }
    } : {
      name: '',
      description: '',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      team: [],
      timeline: {
        phases: [],
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        milestones: []
      },
      manager: {
        id: '',
        name: '',
        email: '',
        role: '',
        skills: [],
        availability: 100
      },
      objectives: [],
      deliverables: [],
      risks: [],
      budget: {
        estimated: 0,
        actual: 0,
        variance: 0
      }
    }
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">
          {project ? 'Editar Projeto' : 'Novo Projeto'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              {...register('name', { required: 'Nome é obrigatório' })}
              className="w-full p-2 border rounded"
              placeholder="Nome do projeto"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              {...register('description', { required: 'Descrição é obrigatória' })}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Descrição do projeto"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data de Início</label>
              <input
                type="date"
                {...register('startDate', { required: 'Data de início é obrigatória' })}
                className="w-full p-2 border rounded"
              />
              {errors.startDate && (
                <span className="text-red-500 text-sm">{errors.startDate.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Data de Término</label>
              <input
                type="date"
                {...register('endDate', { required: 'Data de término é obrigatória' })}
                className="w-full p-2 border rounded"
              />
              {errors.endDate && (
                <span className="text-red-500 text-sm">{errors.endDate.message}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 