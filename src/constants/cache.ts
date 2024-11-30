export const CACHE_KEYS = {
  USER: '@AxiON:user',
  AUTH_TOKEN: '@AxiON:token',
  PENDING_REGISTRATION: '@AxiON:pending_registration',
  PROJECTS: '@AxiON:projects',
  TASKS: '@AxiON:tasks',
  SETTINGS: '@AxiON:settings',
  LAST_SYNC: '@AxiON:last_sync',
  SYNC_LOGS: '@AxiON:sync_logs'
} as const;

export type CacheKey = typeof CACHE_KEYS[keyof typeof CACHE_KEYS]; 