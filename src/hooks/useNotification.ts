import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function useNotification() {
  return {
    success: (message: string, options?: ToastOptions) => 
      toast.success(message, { ...defaultOptions, ...options }),
      
    error: (message: string, options?: ToastOptions) => 
      toast.error(message, { ...defaultOptions, ...options }),
      
    warning: (message: string, options?: ToastOptions) => 
      toast.warning(message, { ...defaultOptions, ...options }),
      
    info: (message: string, options?: ToastOptions) => 
      toast.info(message, { ...defaultOptions, ...options }),
      
    loading: (message: string, options?: ToastOptions) => 
      toast.loading(message, { ...defaultOptions, ...options }),
      
    dismiss: (id?: number) => toast.dismiss(id),
    
    update: (id: number, options: ToastOptions) => toast.update(id, options),
  };
} 