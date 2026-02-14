'use client';

import { useCallback } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';

export function useToast() {
  const { showToast } = useNotificationStore();

  const success = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: 'success',
        title,
        message,
      });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: 'error',
        title,
        message,
      });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: 'info',
        title,
        message,
      });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: 'warning',
        title,
        message,
      });
    },
    [showToast]
  );

  return {
    success,
    error,
    info,
    warning,
  };
}
