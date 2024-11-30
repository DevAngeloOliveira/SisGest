import { motion, AnimatePresence } from 'framer-motion';
import { FiBell } from 'react-icons/fi';

interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
}

export function NotificationBadge({ count, onClick }: NotificationBadgeProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
      onClick={onClick}
    >
      <FiBell className="w-5 h-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs font-medium text-white">
              {count > 9 ? '9+' : count}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
} 