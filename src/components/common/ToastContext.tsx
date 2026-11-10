import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3800) => {
      const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const newToast: ToastItem = { id, message, type };

      setToasts((prev) => [...prev.slice(-3), newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error', 4500), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);
  const warning = useCallback((msg: string) => showToast(msg, 'warning', 4200), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div className="no-print fixed top-16 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let borderClass = 'border-[#d4a84a] text-[#f3d48d] bg-[#221a14]';

          if (toast.type === 'success') {
            borderClass = 'border-[#4ade80] text-[#86efac] bg-[#122416]';
          } else if (toast.type === 'error') {
            borderClass = 'border-[#ef4444] text-[#fca5a5] bg-[#281113]';
          } else if (toast.type === 'warning') {
            borderClass = 'border-[#f59e0b] text-[#fde68a] bg-[#271d0e]';
          } else if (toast.type === 'info') {
            borderClass = 'border-[#60a5fa] text-[#93c5fd] bg-[#111c2e]';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto border rounded-xl shadow-2xl p-3 text-xs font-medium flex items-start gap-2.5 backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${borderClass}`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#4ade80]" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ef4444]" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#f59e0b]" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#60a5fa]" />
              ) : (
                <SparkleIcon className="w-4 h-4 shrink-0 mt-0.5 text-[#f3d48d]" />
              )}
              <p className="flex-1 leading-snug break-words">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 text-[#f3d48d]"
    {...props}
  >
    <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
  </svg>
);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      showToast: (msg: string) => console.log('[Toast]', msg),
      success: (msg: string) => console.log('[Toast:success]', msg),
      error: (msg: string) => console.error('[Toast:error]', msg),
      info: (msg: string) => console.log('[Toast:info]', msg),
      warning: (msg: string) => console.warn('[Toast:warning]', msg),
    };
  }
  return context;
};
