import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { UserRole } from '../features/auth/types/auth.types';

interface MenuItem {
  title: string;
  path: string;
  icon: JSX.Element;
  permission: string;
  roles?: UserRole[];
}

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      permission: 'view_dashboard',
    },
    {
      title: 'Projetos',
      path: '/projects',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      permission: 'view_projects',
    },
    {
      title: 'Tarefas',
      path: '/tasks',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      permission: 'view_tasks',
    },
    {
      title: 'Gerenciar Usuários',
      path: '/admin/users',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      permission: 'manage_users',
      roles: ['ADMIN'],
    },
    {
      title: 'Relatórios',
      path: '/reports',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      permission: 'view_reports',
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      title: 'Logs do Sistema',
      path: '/admin/logs',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      permission: 'view_logs',
      roles: ['ADMIN'],
    },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isOpen ? 256 : 80,
          transition: { duration: 0.2, ease: 'easeInOut' }
        }}
        className={`fixed inset-y-0 left-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 flex flex-col ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        } transition-transform duration-200`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10">
              <div className="flex items-center justify-center w-full h-full shadow-lg rounded-xl bg-gradient-to-tr from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
                <div className="w-6 h-6 rounded-lg bg-white/30" />
              </div>
            </div>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text"
              >
                SisGest
              </motion.span>
            )}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (!can(item.permission, { allowedRoles: item.roles })) return null;

            const isActive = location.pathname === item.path;

            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className={`${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                    {item.icon}
                  </span>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-3 font-medium"
                    >
                      {item.title}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeMenuItem"
                      className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full dark:bg-blue-400"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Tooltip */}
                {!isOpen && (
                  <div className="absolute z-50 hidden ml-2 left-full group-hover:block">
                    <div className="px-2 py-1 text-sm text-white bg-gray-900 rounded-md whitespace-nowrap">
                      {item.title}
                    </div>
                    <div className="absolute -mt-1 border-4 border-transparent top-1/2 -left-1 border-r-gray-900" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`flex ${isOpen ? 'items-center space-x-3' : 'flex-col items-center space-y-2'}`}>
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg shadow-lg bg-gradient-to-tr from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
              <span className="text-lg font-bold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === 'ADMIN' ? 'Administrador' :
                   user?.role === 'MANAGER' ? 'Gerente' : 'Colaborador'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-150 shadow-md hover:shadow-lg`}
          >
            {isOpen ? (
              'Sair'
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
} 