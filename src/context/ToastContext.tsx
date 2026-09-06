import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const toast: Toast = { id, type, title, message, duration };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    addToast('success', title, message);
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast('error', title, message, 7000);
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast('warning', title, message, 6000);
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast('info', title, message);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const config = {
    success: {
      icon: CheckCircle,
      bgClass: 'bg-emerald-50 border-emerald-200',
      iconClass: 'text-emerald-500',
      titleClass: 'text-emerald-900',
      messageClass: 'text-emerald-700'
    },
    error: {
      icon: AlertCircle,
      bgClass: 'bg-red-50 border-red-200',
      iconClass: 'text-red-500',
      titleClass: 'text-red-900',
      messageClass: 'text-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-amber-50 border-amber-200',
      iconClass: 'text-amber-500',
      titleClass: 'text-amber-900',
      messageClass: 'text-amber-700'
    },
    info: {
      icon: Info,
      bgClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-500',
      titleClass: 'text-blue-900',
      messageClass: 'text-blue-700'
    }
  };

  const { icon: Icon, bgClass, iconClass, titleClass, messageClass } = config[toast.type];

  return (
    <div
      className={`pointer-events-auto ${bgClass} border rounded-xl shadow-lg p-4 animate-slide-in`}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${iconClass}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${titleClass}`}>{toast.title}</p>
          {toast.message && (
            <p className={`text-sm mt-1 ${messageClass}`}>{toast.message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ToastProvider;