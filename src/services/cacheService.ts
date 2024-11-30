import { CACHE_KEYS } from '../constants/cache';
export { CACHE_KEYS };

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, any>;

  private constructor() {
    this.cache = new Map();
    this.loadFromLocalStorage();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private loadFromLocalStorage() {
    Object.values(CACHE_KEYS).forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          this.cache.set(key, JSON.parse(value));
        } catch (error) {
          console.error(`Error loading cache for key ${key}:`, error);
        }
      }
    });
  }

  set(key: string, value: any, persist: boolean = true): void {
    this.cache.set(key, value);
    if (persist) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  get<T>(key: string): T | null {
    return this.cache.get(key) || null;
  }

  remove(key: string): void {
    this.cache.delete(key);
    localStorage.removeItem(key);
  }

  clear(): void {
    this.cache.clear();
    localStorage.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  sync(): Promise<void> {
    // Implementar sincronização com o backend
    return Promise.resolve();
  }
}

export const cacheService = CacheService.getInstance(); 