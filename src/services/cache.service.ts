type CacheItem<T> = {
    data: T;
    timestamp: number;
    expiresIn?: number;
};

class CacheService {
    private readonly PREFIX = '@SisGest:';

    set<T>(key: string, data: T, expiresIn?: number): void {
        const item: CacheItem<T> = {
            data,
            timestamp: new Date().getTime(),
            expiresIn
        };
        localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
    }

    get<T>(key: string): T | null {
        const item = localStorage.getItem(this.PREFIX + key);
        if (!item) return null;

        const cached = JSON.parse(item) as CacheItem<T>;

        if (cached.expiresIn && this.isExpired(cached)) {
            this.remove(key);
            return null;
        }

        return cached.data;
    }

    remove(key: string): void {
        localStorage.removeItem(this.PREFIX + key);
    }

    clear(): void {
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.PREFIX))
            .forEach(key => localStorage.removeItem(key));
    }

    private isExpired(item: CacheItem<unknown>): boolean {
        if (!item.expiresIn) return false;
        const now = new Date().getTime();
        return now - item.timestamp > item.expiresIn;
    }
}

export const cacheService = new CacheService(); 