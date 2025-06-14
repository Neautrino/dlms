import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  icon?: string;
}

export const useToast = () => {
  const showToast = (type: ToastType, options: ToastOptions) => {
    const { title, description, duration = 3000, position = 'bottom-right', icon } = options;

    switch (type) {
      case 'success':
        toast.success(title, {
          description,
          duration,
          position,
          icon: icon || '✅'
        });
        break;
      case 'error':
        toast.error(title, {
          description,
          duration,
          position,
          icon: icon || '❌'
        });
        break;
      case 'info':
        toast.info(title, {
          description,
          duration,
          position,
          icon: icon || 'ℹ️'
        });
        break;
      case 'warning':
        toast.warning(title, {
          description,
          duration,
          position,
          icon: icon || '⚠️'
        });
        break;
    }
  };

  return {
    toast: showToast,
  };
}; 