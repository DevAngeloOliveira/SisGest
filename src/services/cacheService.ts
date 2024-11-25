import { Project } from '@/types/project.types';
import { Task } from '@/types/task.types';
import { User } from '@/features/auth/types/auth.types';

export const CACHE_KEYS = {
  tasks: 'tasks',
  projects: 'projects',
  users: 'users',
  logs: 'logs',
  dashboardStats: 'dashboardStats'
} as const;

export type CacheKeys = typeof CACHE_KEYS[keyof typeof CACHE_KEYS];

class CacheService {
  private storage: Storage = localStorage;

  set<T>(key: CacheKeys, data: T): void {
    this.storage.setItem(key, JSON.stringify(data));
  }

  get<T>(key: CacheKeys): T | null {
    const data = this.storage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  remove(key: CacheKeys): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  // Métodos específicos
  getProjects(): Project[] {
    return this.get<Project[]>(CACHE_KEYS.projects) || [];
  }

  setProjects(projects: Project[]): void {
    this.set(CACHE_KEYS.projects, projects);
  }

  getTasks(): Task[] {
    return this.get<Task[]>(CACHE_KEYS.tasks) || [];
  }

  setTasks(tasks: Task[]): void {
    this.set(CACHE_KEYS.tasks, tasks);
  }

  getUsers(): User[] {
    return this.get<User[]>(CACHE_KEYS.users) || [];
  }

  setUsers(users: User[]): void {
    this.set(CACHE_KEYS.users, users);
  }
}

export const cacheService = new CacheService(); 