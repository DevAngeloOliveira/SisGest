import { useState, useEffect } from 'react';
import { cacheService, CACHE_KEYS } from '../services/cacheService';

export function useCache<T>(key: keyof typeof CACHE_KEYS) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const cached = cacheService.get<T>(CACHE_KEYS[key]);
    if (cached) {
      setData(cached);
    }
  }, [key]);

  const updateCache = (newData: T) => {
    setData(newData);
    cacheService.set(CACHE_KEYS[key], newData);
  };

  const clearCache = () => {
    setData(null);
    cacheService.remove(CACHE_KEYS[key]);
  };

  return { data, updateCache, clearCache };
} 