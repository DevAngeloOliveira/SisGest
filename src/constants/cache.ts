export const CACHE_KEYS = {
  tasks: 'tasks',
  projects: 'projects',
  users: 'users',
  logs: 'logs',
  dashboardStats: 'dashboardStats'
} as const;

export type CacheKeys = typeof CACHE_KEYS[keyof typeof CACHE_KEYS]; 