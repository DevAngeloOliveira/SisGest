import { User } from '../features/auth/types/auth.types';

export type CacheKeys = 
  | 'projects'
  | 'tasks'
  | 'users'
  | 'logs'
  | 'dashboardStats'
  | 'projectStats'
  | 'userPreferences';

class CacheService {
  private cache: Map<string, unknown> = new Map();
  private expirationTimes: Map<string, number> = new Map();
  private defaultExpiration = 30 * 60 * 1000; // 30 minutos

  set<T>(key: CacheKeys, value: T, expirationMs?: number): void {
    this.cache.set(key, value);
    this.expirationTimes.set(
      key,
      Date.now() + (expirationMs || this.defaultExpiration)
    );
    this.persistToLocalStorage(key, value);
  }

  get<T>(key: CacheKeys): T | null {
    // Verifica expiração
    const expirationTime = this.expirationTimes.get(key);
    if (expirationTime && Date.now() > expirationTime) {
      this.remove(key);
      return null;
    }

    // Tenta obter do cache em memória
    const cachedValue = this.cache.get(key);
    if (cachedValue !== undefined) {
      return cachedValue as T;
    }

    // Se não estiver em memória, tenta recuperar do localStorage
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      this.cache.set(key, parsed);
      return parsed;
    }

    return null;
  }

  remove(key: CacheKeys): void {
    this.cache.delete(key);
    this.expirationTimes.delete(key);
    localStorage.removeItem(key);
  }

  clear(): void {
    this.cache.clear();
    this.expirationTimes.clear();
    localStorage.clear();
  }

  private persistToLocalStorage(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erro ao persistir no localStorage:', error);
      // Se o localStorage estiver cheio, limpa dados antigos
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.clearOldData();
        // Tenta novamente
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  }

  private clearOldData(): void {
    const keys = Array.from(this.expirationTimes.keys());
    keys.sort((a, b) => {
      const timeA = this.expirationTimes.get(a) || 0;
      const timeB = this.expirationTimes.get(b) || 0;
      return timeA - timeB;
    });

    // Remove os 50% mais antigos
    const halfLength = Math.floor(keys.length / 2);
    keys.slice(0, halfLength).forEach(key => {
      this.remove(key as CacheKeys);
    });
  }

  // Métodos específicos para cada tipo de dado
  getUsers(): User[] {
    return this.get<User[]>('users') || [];
  }

  setUsers(users: User[]): void {
    this.set('users', users);
  }

  getProjectStats(projectId: string): unknown {
    const stats = this.get<Record<string, unknown>>('projectStats');
    return stats?.[projectId] || null;
  }

  setProjectStats(projectId: string, stats: unknown): void {
    const allStats = this.get<Record<string, unknown>>('projectStats') || {};
    allStats[projectId] = stats;
    this.set('projectStats', allStats);
  }

  async sync(): Promise<boolean> {
    try {
      // Implementar lógica de sincronização com backend quando necessário
      return true;
    } catch {
      return false;
    }
  }
}

export const cacheService = new CacheService();

export const CACHE_KEYS = {
  projects: 'projects',
  tasks: 'tasks',
  users: 'users',
  logs: 'logs',
  dashboardStats: 'dashboardStats',
  projectStats: 'projectStats',
  userPreferences: 'userPreferences'
} as const;

// Interfaces auxiliares
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo: string[];
  estimatedHours: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  projectId: string;
  assignedTo: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedHours: number;
  workedHours: number;
}

interface DashboardStats {
  activeProjects: number;
  completedTasks: number;
  totalHours: number;
  projectsGrowth: number;
  tasksGrowth: number;
  hoursGrowth: number;
} 