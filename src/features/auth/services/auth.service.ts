import { LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { User } from '@/types/common';

class AuthService {
    private storageKey = '@sisgest:auth';

    async login(credentials: LoginCredentials): Promise<User> {
        // Simulação de login
        const user: User = {
            id: '1',
            name: 'Admin',
            email: credentials.email,
            role: 'ADMIN',
            permissions: ['all'],
            avatar: 'https://github.com/admin.png',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            updatedBy: 'system'
        };

        localStorage.setItem(this.storageKey, JSON.stringify({ user }));
        return user;
    }

    async register(data: RegisterCredentials): Promise<User> {
        // Simulação de registro
        const user: User = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            role: 'USER',
            permissions: ['view_projects', 'update_tasks'],
            avatar: `https://github.com/${data.name}.png`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            updatedBy: 'system'
        };

        localStorage.setItem(this.storageKey, JSON.stringify({ user }));
        return user;
    }

    async logout(): Promise<void> {
        localStorage.removeItem(this.storageKey);
    }

    async getCurrentUser(): Promise<User | null> {
        const data = localStorage.getItem(this.storageKey);
        if (!data) return null;

        const { user } = JSON.parse(data);
        return user;
    }

    async updateUser(data: Partial<User>): Promise<User> {
        const currentUser = await this.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not found');
        }

        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem(this.storageKey, JSON.stringify({ user: updatedUser }));
        return updatedUser;
    }
}

export const authService = new AuthService(); 