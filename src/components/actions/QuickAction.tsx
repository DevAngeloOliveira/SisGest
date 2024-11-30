import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface QuickActionProps {
  icon: IconType;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function QuickAction({ icon: Icon, label, onClick, variant = 'primary' }: QuickActionProps) {
  const baseClasses = "px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2";
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30",
    secondary: "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 shadow-lg shadow-neutral-500/10 hover:shadow-neutral-500/20"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </motion.button>
  );
} 