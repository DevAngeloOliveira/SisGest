import { FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 fixed w-full top-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Abrir menu</span>
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-500">
              SisGest
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={toggleTheme}
          >
            <span className="sr-only">Alternar tema</span>
            {theme === 'dark' ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {user?.avatar ? (
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-primary-500"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary-500 ring-2 ring-primary-300 flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 