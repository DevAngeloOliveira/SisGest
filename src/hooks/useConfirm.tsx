import { useCallback } from 'react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

export function useConfirm() {
  const confirm = useCallback(async (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const confirmed = window.confirm(options.message);
      resolve(confirmed);
    });
  }, []);

  return { confirm };
} 