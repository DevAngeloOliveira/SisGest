import { User } from '@/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

interface UserFormModalProps {
  selectedUser?: User;
  onClose: () => void;
  onSave: (userData: UserFormData) => Promise<void>;
}

export function UserFormModal({ selectedUser, onClose, onSave }: UserFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    defaultValues: selectedUser ? {
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      permissions: selectedUser.permissions,
      avatar: selectedUser.avatar
    } : undefined
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              {...register('name', { required: 'Nome é obrigatório' })}
              className="w-full p-2 border rounded"
              placeholder="Nome do usuário"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              className="w-full p-2 border rounded"
              placeholder="email@exemplo.com"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Função</label>
            <select
              {...register('role')}
              className="w-full p-2 border rounded"
            >
              <option value="USER">Usuário</option>
              <option value="MANAGER">Gerente</option>
              <option value="ADMIN">Administrador</option>
            </select>
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 