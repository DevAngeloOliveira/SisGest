import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface EnhancedQuickActionProps {
  icon: IconType;
  label: string;
  description?: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  badge?: number | string;
}

const variants = {
  primary: "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white",
  secondary: "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50",
  success: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white",
  warning: "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white",
  danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};

export function EnhancedQuickAction({
  icon: Icon,
  label,
  description,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  badge
}: EnhancedQuickActionProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative rounded-lg font-medium shadow-lg 
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200 flex items-center space-x-3
      `}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || loading}
    >
      {/* Icon */}
      <div className={`
        ${loading ? 'animate-spin' : ''}
        ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'}
      `}>
        <Icon />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-start">
        <span>{label}</span>
        {description && (
          <span className="text-sm opacity-80">{description}</span>
        )}
      </div>

      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            absolute -top-2 -right-2 min-w-[20px] h-5 
            px-1.5 rounded-full bg-red-500 text-white text-xs 
            flex items-center justify-center font-bold
          `}
        >
          {badge}
        </motion.div>
      )}

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-white opacity-0 pointer-events-none"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
} 