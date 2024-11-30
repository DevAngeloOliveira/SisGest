import { ElementType } from 'react';
import { FiHome, FiFolder, FiCheckSquare, FiUsers, FiSettings, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { Permission } from '../types/common';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

interface NavItem {
  label: string;
  path: string;
  icon: ElementType;
  permissions: Permission[];
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: FiHome,
    permissions: []
  },
  {
    label: 'Projetos',
    path: '/projects',
    icon: FiFolder,
    permissions: ['manage_projects', 'view_projects']
  },
  {
    label: 'Tarefas',
    path: '/tasks',
    icon: FiCheckSquare,
    permissions: ['manage_tasks', 'update_tasks']
  },
  {
    label: 'Usuários',
    path: '/users',
    icon: FiUsers,
    permissions: ['all']
  },
  {
    label: 'Configurações',
    path: '/settings',
    icon: FiSettings,
    permissions: ['all']
  }
];

export function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const { hasAnyPermission } = usePermissions();

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    ${isMobile ? 'lg:hidden' : 'hidden lg:block lg:translate-x-0'}
    transition-transform duration-300 ease-in-out
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          SisGest
        </span>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 text-gray-500 rounded-lg hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <FiX className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="px-2 mt-4 space-y-1">
        {navItems.map(item => {
          if (item.permissions.length > 0 && !hasAnyPermission(item.permissions)) {
            return null;
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-2 text-sm font-medium rounded-lg
                ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                }
              `}
            >
              {/* @ts-ignore */}
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
} 