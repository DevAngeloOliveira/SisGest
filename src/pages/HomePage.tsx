import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/shared/Card';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Bem-vindo, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Projetos">
          <div className="space-y-4">
            <p className="text-gray-600">
              Gerencie seus projetos e acompanhe o progresso.
            </p>
            <button
              onClick={() => {}}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Ver Projetos
            </button>
          </div>
        </Card>

        <Card title="Tarefas">
          <div className="space-y-4">
            <p className="text-gray-600">
              Organize suas tarefas e mantenha-se produtivo.
            </p>
            <button
              onClick={() => {}}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Ver Tarefas
            </button>
          </div>
        </Card>

        <Card title="Equipe">
          <div className="space-y-4">
            <p className="text-gray-600">
              Gerencie sua equipe e colabore em projetos.
            </p>
            <button
              onClick={() => {}}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Ver Equipe
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
} 