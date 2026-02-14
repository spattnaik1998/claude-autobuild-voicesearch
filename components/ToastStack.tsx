'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

const ICON_MAP = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const COLOR_MAP = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-200',
    icon: 'text-green-600 dark:text-green-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-200',
    icon: 'text-red-600 dark:text-red-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-200',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-200',
    icon: 'text-amber-600 dark:text-amber-400',
  },
};

export function ToastStack() {
  const { toasts, dismissToast, clearAllTimeouts } = useNotificationStore();

  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.slice(-3).map((toast) => {
        const colors = COLOR_MAP[toast.type];

        return (
          <div
            key={toast.id}
            className={`${colors.bg} ${colors.border} ${colors.text} px-4 py-3 rounded-xl border shadow-lg backdrop-blur-xl animate-in slide-in-from-right-5 duration-300 pointer-events-auto max-w-sm`}
          >
            <div className="flex items-start gap-3">
              <span className={`text-lg flex-shrink-0 ${colors.icon}`}>
                {ICON_MAP[toast.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs mt-1 opacity-80">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-sm opacity-50 hover:opacity-100 flex-shrink-0 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
