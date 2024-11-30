import { ToastContainer, toast } from 'react-toastify';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const NotificationIcon = ({ type }: { type: string }) => {
  const icons = {
    success: <FiCheck className="w-6 h-6" />,
    error: <FiX className="w-6 h-6" />,
    info: <FiInfo className="w-6 h-6" />,
    warning: <FiAlertTriangle className="w-6 h-6" />
  };

  return icons[type as keyof typeof icons] || null;
};

export function NotificationSystem() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      toastClassName="relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer"
      bodyClassName="flex text-sm font-medium"
      progressClassName="Toastify__progress-bar--animated Toastify__progress-bar"
    />
  );
}

export const useNotification = () => {
  return {
    success: (message: string) => toast.success(message, {
      icon: <NotificationIcon type="success" />,
      className: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    }),
    error: (message: string) => toast.error(message, {
      icon: <NotificationIcon type="error" />,
      className: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    }),
    info: (message: string) => toast.info(message, {
      icon: <NotificationIcon type="info" />,
      className: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    }),
    warning: (message: string) => toast.warning(message, {
      icon: <NotificationIcon type="warning" />,
      className: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    })
  };
}; 