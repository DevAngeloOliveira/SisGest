import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Carregando...', size = 'md' }: LoadingStateProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={`${sizes[size]} border-2 border-primary-200 border-t-primary-600 rounded-full`}
      />
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        {message}
      </p>
    </div>
  );
} 