import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ModernCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  badge?: {
    text: string;
    color: 'primary' | 'success' | 'warning' | 'error' | 'info';
  };
}

const badgeColors = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
};

export function ModernCard({ 
  title, 
  subtitle, 
  icon, 
  action, 
  children, 
  className = '', 
  onClick,
  badge 
}: ModernCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      className={`
        bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700
        transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      {(title || subtitle || icon || action || badge) && (
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {badge && (
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${badgeColors[badge.color]}`}>
                {badge.text}
              </span>
            )}
            {action}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
} 