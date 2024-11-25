import { useState, useEffect } from 'react';
import { User, UserRole } from '../../features/auth/types/auth.types';
import { useNotification } from '../../hooks/useNotification';
import { UserFormModal } from '../../features/auth/components/UserFormModal';
import { MESSAGES } from '../../shared/constants/messages';

interface UserWithPassword extends User {
  password?: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithPassword | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notification = useNotification();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      // Remove senha antes de exibir
      const usersWithoutPassword = storedUsers.map(({ password, ...user }: UserWithPassword) => user);
      setUsers(usersWithoutPassword);
    } catch (error) {
      notification.error(MESSAGES.ERROR.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (userData: UserWithPassword) => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = storedUsers.findIndex((u: User) => u.id === userData.id);
      
      if (userIndex === -1) {
        notification.error(MESSAGES.ERROR.NOT_FOUND);
        return;
      }

      // Mantém a senha original e outros dados, atualiza apenas o papel
      const originalUser = storedUsers[userIndex];
      storedUsers[userIndex] = {
        ...originalUser,
        role: userData.role // Atualiza apenas o papel do usuário
      };

      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      loadUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
      notification.success('Papel do usuário atualizado com sucesso');
    } catch (error) {
      notification.error(MESSAGES.ERROR.GENERIC);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Impede a exclusão do próprio admin
      const userToDelete = storedUsers.find((u: User) => u.id === userId);
      if (userToDelete.email === 'gabriel@admin.com.br') {
        notification.error('Não é possível excluir o usuário administrador principal');
        return;
      }

      const updatedUsers = storedUsers.filter((user: User) => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      loadUsers();
      notification.success(MESSAGES.SUCCESS.DELETED);
    } catch (error) {
      notification.error(MESSAGES.ERROR.GENERIC);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'COLLABORATOR':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'MANAGER':
        return 'Gerente';
      case 'COLLABORATOR':
        return 'Colaborador';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gerenciamento de Usuários
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gerencie os papéis e permissões dos usuários do sistema
        </p>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Papel
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      Alterar Papel
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      disabled={user.email === 'gabriel@admin.com.br'}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição de Papel */}
      {isModalOpen && (
        <UserFormModal
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdateUser}
          editMode="role-only"
        />
      )}
    </div>
  );
} 