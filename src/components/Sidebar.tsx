import { ElementType } from 'react';
import { FiHome, FiFolder, FiCheckSquare, FiUsers, FiSettings, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { Permission } from '../types';
import { IconType } from 'react-icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
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
    fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    ${isMobile ? 'lg:hidden' : 'hidden lg:block lg:translate-x-0'}
    transition-transform duration-300 ease-in-out pt-16
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="h-full px-3 py-4 overflow-y-auto">
        <nav className="space-y-1">
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
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 