import { ReactNode, useEffect, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface InitializationWrapperProps {
  children: ReactNode;
}

export function InitializationWrapper({ children }: InitializationWrapperProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Aqui você pode adicionar qualquer lógica de inicialização necessária
        // Por exemplo, carregar configurações, verificar autenticação, etc.
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsInitialized(true);
      } catch (error) {
        console.error('Erro durante a inicialização:', error);
        // Aqui você pode adicionar lógica para lidar com erros de inicialização
      }
    };

    initialize();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Inicializando aplicação...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 