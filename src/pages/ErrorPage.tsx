import { useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Oops!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Desculpe, ocorreu um erro inesperado.
        </p>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
      </div>
    </div>
  );
} 