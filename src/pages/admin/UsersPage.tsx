import { useState } from 'react';
import { User, UserFormData } from '@/features/auth/types/auth.types';
import { useNotification } from '@/hooks/useNotification';
import { UserFormModal } from '@/features/auth/components/UserFormModal';

export function UsersPage() {
  const notification = useNotification();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [showModal, setShowModal] = useState(false);

  const handleUpdateUser = async (userData: UserFormData) => {
    try {
      // Implementar lógica de atualização
      console.log('Atualizando usuário com dados:', userData);
      notification.success('Usuário atualizado com sucesso');
      setShowModal(false);
      setSelectedUser(undefined);
    } catch {
      notification.error('Erro ao atualizar usuário');
    }
  };

  return (
    <div>
      {showModal && (
        <UserFormModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(undefined);
          }}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
} 