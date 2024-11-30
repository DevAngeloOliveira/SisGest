import { openDB, IDBPDatabase } from 'idb';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheService {
  private dbName = 'sisgest-cache';
  private version = 1;
  private db: IDBPDatabase | null = null;

  async init() {
    if (this.db) return;

    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        // Store para dados gerais
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
        // Store específico para projetos
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
      },
    });
  }

  private async ensureDB() {
    if (!this.db) {
      await this.init();
    }
  }

  private isExpired(item: CacheItem<unknown>) {
    return Date.now() - item.timestamp > item.expiresIn;
  }

  async set<T>(key: string, data: T, expiresIn = 1000 * 60 * 60) { // 1 hora por padrão
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };

    await this.db.put('cache', cacheItem, key);
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    const item = await this.db.get('cache', key) as CacheItem<T> | undefined;

    if (!item) return null;
    if (this.isExpired(item)) {
      await this.remove(key);
      return null;
    }

    return item.data;
  }

  async remove(key: string) {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.delete('cache', key);
  }

  async clear() {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.clear('cache');
  }

  // Métodos específicos para projetos
  async setProjects(projects: any[]) {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    const tx = this.db.transaction('projects', 'readwrite');
    await Promise.all([
      ...projects.map(project => tx.store.put(project)),
      tx.done
    ]);
  }

  async getProjects() {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    return this.db.getAll('projects');
  }

  async getProject(id: string) {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    return this.db.get('projects', id);
  }

  async removeProject(id: string) {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.delete('projects', id);
  }

  async clearProjects() {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.clear('projects');
  }
}

export const cacheService = new CacheService(); 