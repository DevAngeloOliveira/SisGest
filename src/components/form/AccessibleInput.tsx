import { forwardRef, InputHTMLAttributes } from 'react';
import { useId } from 'react';

interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ label, error, hint, required, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="mb-4">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        
        {hint && (
          <div
            id={hintId}
            className="text-sm text-gray-500 dark:text-gray-400 mb-1"
          >
            {hint}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={`${hint ? hintId : ''} ${error ? errorId : ''}`}
          aria-required={required}
          className={`
            w-full px-3 py-2 border rounded-md
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
            }
            ${className || ''}
          `}
          {...props}
        />

        {error && (
          <div
            id={errorId}
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
); 