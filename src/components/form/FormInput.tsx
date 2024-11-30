import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            className={`
              block w-full px-4 py-3 bg-neutral-50 border rounded-lg 
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
              dark:bg-neutral-800 dark:text-white transition-colors
              ${error 
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                : 'border-neutral-300 dark:border-neutral-700'
              }
            `}
          />
          {error && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-5 left-0 text-xs text-red-500"
            >
              {error}
            </motion.span>
          )}
        </div>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput'; 