import { User } from '../types/auth.types';
import { cacheService } from '../../../services/cacheService';

interface UserWithPassword extends User {
  password: string;
}

export const setupInitialData = () => {
  const users = cacheService.getUsers();

  // Só adiciona o admin se não existir nenhum usuário
  if (users.length === 0) {
    const adminUser: UserWithPassword = {
      id: crypto.randomUUID(),
      name: 'Gabriel',
      email: 'gabriel@admin.com.br',
      password: 'senha123',
      role: 'ADMIN'
    };

    cacheService.setUsers([adminUser]);
  }

  // Verifica se o admin existe, se não, adiciona
  const adminExists = users.some((user: User) => 
    user.email === 'gabriel@admin.com.br' && user.role === 'ADMIN'
  );

  if (!adminExists && users.length > 0) {
    const adminUser: UserWithPassword = {
      id: crypto.randomUUID(),
      name: 'Gabriel',
      email: 'gabriel@admin.com.br',
      password: 'senha123',
      role: 'ADMIN'
    };

    users.push(adminUser);
    cacheService.setUsers(users);
  }
}; 