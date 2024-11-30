import { Task } from '@/types';
import { useForm } from 'react-hook-form';

interface TaskFormModalProps {
  task?: Task | null;
  onClose: () => void;
  onSave: (data: Partial<Task>) => Promise<void>;
}

export function TaskFormModal({ task, onClose, onSave }: TaskFormModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Task>>({
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours
    } : {
      title: '',
      description: '',
      status: 'NOT_STARTED',
      priority: 'MEDIUM',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedHours: 0,
      actualHours: 0
    }
  });

  const onSubmit = async (data: Partial<Task>) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {task ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              {...register('title', { required: 'Título é obrigatório' })}
              className="w-full p-2 border rounded"
              placeholder="Título da tarefa"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              {...register('description', { required: 'Descrição é obrigatória' })}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Descrição da tarefa"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full p-2 border rounded"
              >
                <option value="NOT_STARTED">Não Iniciada</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="COMPLETED">Concluída</option>
                <option value="ON_HOLD">Em Espera</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <select
                {...register('priority')}
                className="w-full p-2 border rounded"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="CRITICAL">Crítica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data de Vencimento</label>
            <input
              type="date"
              {...register('dueDate', { required: 'Data de vencimento é obrigatória' })}
              className="w-full p-2 border rounded"
            />
            {errors.dueDate && (
              <span className="text-red-500 text-sm">{errors.dueDate.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Horas Estimadas</label>
              <input
                type="number"
                {...register('estimatedHours', { min: 0 })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Horas Realizadas</label>
              <input
                type="number"
                {...register('actualHours', { min: 0 })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
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