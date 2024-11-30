import { toast, ToastOptions } from 'react-toastify';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notification = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
      className: 'bg-primary-500 text-white',
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
      className: 'bg-red-500 text-white',
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      ...defaultOptions,
      ...options,
      className: 'bg-yellow-500 text-white',
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      ...defaultOptions,
      ...options,
      className: 'bg-blue-500 text-white',
    });
  },
}; 