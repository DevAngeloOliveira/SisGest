import { useState, useEffect } from 'react';
import { useTenant } from '@/features/tenant/hooks/useTenant';

export function useInitialization() {
    const [isInitialized, setIsInitialized] = useState(false);
    const { currentTenant } = useTenant();

    useEffect(() => {
        const initialize = async () => {
            try {
                if (currentTenant) {
                    // Inicializar recursos do tenant
                    await Promise.all([
                        // Carregar configurações
                        // Carregar dados iniciais
                        // etc.
                    ]);
                }
            } catch (error) {
                console.error('Error initializing app:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        initialize();
    }, [currentTenant]);

    return {
        isInitialized
    };
} 