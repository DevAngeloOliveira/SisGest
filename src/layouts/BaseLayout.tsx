import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BaseLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function BaseLayout({ children, title, subtitle }: BaseLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
} 