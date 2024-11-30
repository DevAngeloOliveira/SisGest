export class MultitenantCacheService {
    private currentTenant: string = 'default';

    private async initDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('cache', 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                db.createObjectStore('cache', { keyPath: ['tenant', 'key'] });
                db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
            };
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cache', 'readonly');
            const store = tx.objectStore('cache');
            const request = store.get([this.currentTenant || 'default', key]);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result?.value || null);
        });
    }

    async set<T>(key: string, value: T): Promise<void> {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cache', 'readwrite');
            const store = tx.objectStore('cache');
            const request = store.put({
                tenant: this.currentTenant || 'default',
                key,
                value
            });

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async delete(key: string): Promise<void> {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('cache', 'readwrite');
            const store = tx.objectStore('cache');
            const request = store.delete([this.currentTenant || 'default', key]);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
}

export const multitenantCache = new MultitenantCacheService(); 