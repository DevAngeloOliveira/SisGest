import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface ActionButtonProps {
  icon: IconType;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  badge?: number;
}

export function ActionButton({ icon: Icon, label, onClick, variant = 'primary', badge }: ActionButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white",
    secondary: "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative px-4 py-2.5 rounded-lg font-medium shadow-lg 
        ${variants[variant]}
        transition-all duration-200 flex items-center space-x-2
      `}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {badge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
        >
          {badge}
        </motion.span>
      )}
      
      {/* Efeito de brilho no hover */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-white opacity-0 pointer-events-none"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
} 