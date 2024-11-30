import { useState, useEffect } from 'react';
import { useNotification } from './useNotification';

export function useOffline() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const notification = useNotification();

    useEffect(() => {
        function handleOnline() {
            setIsOffline(false);
            notification.success('Conexão restabelecida!');
        }

        function handleOffline() {
            setIsOffline(true);
            notification.warning('Você está offline. Algumas funcionalidades podem estar limitadas.');
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [notification]);

    return {
        isOffline,
        // Função auxiliar para verificar se está online
        isOnline: !isOffline
    };
} 