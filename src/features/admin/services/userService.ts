import { User, UserRole, Permission } from '@/types';
import { UserFormData } from '../components/UserFormModal';

class UserService {
    private storageKey = '@sisgest:users';

    async getUsers(): Promise<User[]> {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    async getUserById(id: string): Promise<User | null> {
        const users = await this.getUsers();
        return users.find(u => u.id === id) || null;
    }

    async createUser(data: UserFormData): Promise<User> {
        const users = await this.getUsers();

        const newUser: User = {
            ...data,
            role: data.role as UserRole,
            permissions: data.permissions as Permission[],
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            updatedBy: 'system'
        };

        users.push(newUser);
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return newUser;
    }

    async updateUser(id: string, data: UserFormData): Promise<User> {
        const users = await this.getUsers();
        const index = users.findIndex(u => u.id === id);

        if (index === -1) {
            throw new Error('User not found');
        }

        const updatedUser: User = {
            ...users[index],
            ...data,
            role: data.role as UserRole,
            permissions: data.permissions as Permission[],
            updatedAt: new Date().toISOString(),
            updatedBy: 'system'
        };

        users[index] = updatedUser;
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        const users = await this.getUsers();
        const filteredUsers = users.filter(u => u.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
    }
}

export const userService = new UserService(); 