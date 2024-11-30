import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const icons = {
  success: <FiCheck className="w-6 h-6" />,
  error: <FiX className="w-6 h-6" />,
  info: <FiInfo className="w-6 h-6" />,
  warning: <FiAlertTriangle className="w-6 h-6" />
};

export function Toast({ type = 'info', message }: ToastProps) {
  return (
    <div className={`
      flex items-center p-4 rounded-lg shadow-lg
      ${type === 'success' && 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400'}
      ${type === 'error' && 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}
      ${type === 'info' && 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}
      ${type === 'warning' && 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}
    `}>
      <div className="flex-shrink-0 mr-3">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}

export const useToast = () => {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message)
  };
}; 