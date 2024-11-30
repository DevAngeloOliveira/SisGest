import { useState } from 'react';

export function useOfflineData<T>(key: string) {
    const [data, setData] = useState<T | null>(null);

    const saveData = (newData: T) => {
        localStorage.setItem(key, JSON.stringify(newData));
        setData(newData);
    };

    const loadData = () => {
        const savedData = localStorage.getItem(key);
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    };

    const clearData = () => {
        localStorage.removeItem(key);
        setData(null);
    };

    return {
        data,
        saveData,
        loadData,
        clearData
    };
} 