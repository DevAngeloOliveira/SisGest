import { api } from './api';
import { cacheService } from './cacheService';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'current_user';

class AuthService {
    private refreshPromise: Promise<AuthTokens> | null = null;

    constructor() {
        // Configura interceptor para adicionar token em todas as requisições
        api.interceptors.request.use(
            async (config) => {
                const tokens = await this.getTokens();
                if (tokens?.accessToken) {
                    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Configura interceptor para lidar com erros de autenticação
        api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Se o erro for 401 e não for uma tentativa de refresh
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const tokens = await this.refreshAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        // Se o refresh falhar, faz logout
                        await this.logout();
                        throw refreshError;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async login(credentials: LoginCredentials): Promise<User> {
        const response = await api.post<{ user: User } & AuthTokens>('/auth/login', credentials);
        const { user, accessToken, refreshToken } = response.data;

        await this.setTokens({ accessToken, refreshToken });
        await this.setUser(user);

        return user;
    }

    async refreshAccessToken(): Promise<AuthTokens> {
        // Se já houver um refresh em andamento, retorna a mesma Promise
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = (async () => {
            try {
                const tokens = await this.getTokens();
                if (!tokens?.refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await api.post<AuthTokens>('/auth/refresh', {
                    refreshToken: tokens.refreshToken
                });

                const newTokens = response.data;
                await this.setTokens(newTokens);

                return newTokens;
            } finally {
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    async logout(): Promise<void> {
        const tokens = await this.getTokens();
        if (tokens?.refreshToken) {
            try {
                await api.post('/auth/logout', { refreshToken: tokens.refreshToken });
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }

        await this.clearAuth();
    }

    async getUser(): Promise<User | null> {
        return cacheService.get<User>(USER_KEY);
    }

    private async setUser(user: User): Promise<void> {
        await cacheService.set(USER_KEY, user);
    }

    private async getTokens(): Promise<AuthTokens | null> {
        return cacheService.get<AuthTokens>(TOKEN_KEY);
    }

    private async setTokens(tokens: AuthTokens): Promise<void> {
        await cacheService.set(TOKEN_KEY, tokens);
    }

    private async clearAuth(): Promise<void> {
        await cacheService.remove(TOKEN_KEY);
        await cacheService.remove(USER_KEY);
    }

    async isAuthenticated(): Promise<boolean> {
        const tokens = await this.getTokens();
        return !!tokens?.accessToken;
    }
}

export const authService = new AuthService(); 