import { useState, useEffect } from 'react';
import { User } from '../../types';
import { UserFormModal, UserFormData } from '../../features/admin/components/UserFormModal';
import { userService } from '../../features/admin/services/userService';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSaveUser = async (data: UserFormData) => {
    try {
      if (selectedUser) {
        const updatedUser = await userService.updateUser(selectedUser.id, data);
        setUsers(prev => prev.map(user => user.id === selectedUser.id ? updatedUser : user));
      } else {
        const newUser = await userService.createUser(data);
        setUsers(prev => [...prev, newUser]);
      }
      setIsModalOpen(false);
      setSelectedUser(undefined);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <button
          onClick={() => {
            setSelectedUser(undefined);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          Novo Usuário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex items-center space-x-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setIsModalOpen(true);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <UserFormModal
          selectedUser={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(undefined);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
} 