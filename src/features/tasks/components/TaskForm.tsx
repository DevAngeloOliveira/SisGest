import { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '../types/tasks.types';
import { TeamMember } from '../../projects/types/projects.types';
import { useNotification } from '../../../hooks/useNotification';
import { motion } from 'framer-motion';

interface TaskFormProps {
  projectId: string;
  task?: Task;
  availableMembers: TeamMember[];
  onSubmit: (taskData: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({ projectId, task, availableMembers, onSubmit, onCancel }: TaskFormProps) {
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    projectId,
    status: 'TODO',
    priority: 'MEDIUM',
    members: [],
    createdBy: '', // Será preenchido no submit
    startDate: new Date(),
    dueDate: new Date(),
    estimatedHours: 0,
    workedHours: 0,
    tags: [],
    dependencies: [],
    subtasks: [],
    checklist: []
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
      setSelectedMembers(task.members.map(member => member.id));
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (!formData.title.trim()) {
        throw new Error('O título é obrigatório');
      }

      if (selectedMembers.length === 0) {
        throw new Error('Selecione pelo menos um membro para a tarefa');
      }

      // Atualiza os membros da tarefa
      const taskMembers = selectedMembers.map(memberId => {
        const member = availableMembers.find(m => m.id === memberId);
        if (!member) throw new Error('Membro não encontrado');
        
        return {
          id: member.id,
          name: member.name,
          role: member.role,
          assignedAt: new Date(),
          workHours: 0
        };
      });

      await onSubmit({
        ...formData,
        members: taskMembers
      });

      notification.success(task ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
    } catch (error) {
      notification.error(error instanceof Error ? error.message : 'Erro ao salvar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: TaskStatus[] = [
    'TODO',
    'IN_PROGRESS',
    'IN_REVIEW',
    'BLOCKED',
    'COMPLETED'
  ];

  const priorityOptions: TaskPriority[] = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
  ];

  const getStatusLabel = (status: TaskStatus) => {
    const labels = {
      'TODO': 'A Fazer',
      'IN_PROGRESS': 'Em Andamento',
      'IN_REVIEW': 'Em Revisão',
      'BLOCKED': 'Bloqueada',
      'COMPLETED': 'Concluída'
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    const labels = {
      'LOW': 'Baixa',
      'MEDIUM': 'Média',
      'HIGH': 'Alta',
      'URGENT': 'Urgente'
    };
    return labels[priority];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Informações da Tarefa
        </h3>
        
        <div className="grid gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prioridade
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {getPriorityLabel(priority)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Membros da Tarefa */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Membros da Tarefa
        </h3>

        <div className="space-y-4">
          {availableMembers.map((member) => (
            <label key={member.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedMembers.includes(member.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMembers([...selectedMembers, member.id]);
                  } else {
                    setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {member.role}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Datas e Horas */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Datas e Horas
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Início
            </label>
            <input
              type="date"
              value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Término
            </label>
            <input
              type="date"
              value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Horas Estimadas
            </label>
            <input
              type="number"
              min="0"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {task && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Horas Trabalhadas
              </label>
              <input
                type="number"
                min="0"
                value={formData.workedHours}
                onChange={(e) => setFormData({ ...formData, workedHours: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : task ? 'Atualizar Tarefa' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
} 