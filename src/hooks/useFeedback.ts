import { useState, useCallback } from 'react';
import { useNotification } from './useNotification';

interface UseFeedbackOptions {
    successMessage?: string;
    errorMessage?: string;
}

export function useFeedback<T extends (...args: any[]) => Promise<any>>(
    action: T,
    options: UseFeedbackOptions = {}
) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const notification = useNotification();

    const execute = useCallback(async (...args: Parameters<T>) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await action(...args);
            if (options.successMessage) {
                notification.success(options.successMessage);
            }
            return result;
        } catch (err) {
            const errorMessage = options.errorMessage ||
                (err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
            setError(err as Error);
            notification.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [action, notification, options]);

    return {
        execute,
        isLoading,
        error,
        reset: () => setError(null)
    };
} 