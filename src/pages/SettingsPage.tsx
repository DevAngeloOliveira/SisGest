import { Card } from '../components/shared/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const handleThemeChange = () => {
    toggleTheme();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Aparência">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Tema Escuro</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={handleThemeChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        <Card title="Conta">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {user?.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => {}}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Atualizar Perfil
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
} 