import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationStoreState {
  notifications: Notification[];
  toasts: Notification[];
  unreadCount: number;
  toastTimeouts: Map<string, NodeJS.Timeout>;
}

interface NotificationStoreActions {
  addNotification: (
    notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
  ) => void;
  showToast: (toast: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  dismissToast: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  clearAllTimeouts: () => void;
}

type NotificationStore = NotificationStoreState & NotificationStoreActions;

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  toasts: [],
  unreadCount: 0,
  toastTimeouts: new Map(),

  addNotification: (notif) => {
    const newNotification: Notification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      isRead: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  showToast: (toast) => {
    const newToast: Notification = {
      ...toast,
      id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      isRead: true,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss after 3 seconds
    const timeoutId = setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== newToast.id),
        toastTimeouts: new Map(state.toastTimeouts) // Clean up on dismiss
      }));
    }, 3000);

    // Track timeout ID for cleanup
    set((state) => {
      const newTimeouts = new Map(state.toastTimeouts);
      newTimeouts.set(newToast.id, timeoutId);
      return { toastTimeouts: newTimeouts };
    });

    return () => clearTimeout(timeoutId);
  },

  dismissToast: (id) => {
    set((state) => {
      // Clear associated timeout
      const timeout = state.toastTimeouts.get(id);
      if (timeout) {
        clearTimeout(timeout);
      }
      const newTimeouts = new Map(state.toastTimeouts);
      newTimeouts.delete(id);

      return {
        toasts: state.toasts.filter((t) => t.id !== id),
        toastTimeouts: newTimeouts,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  clearAll: () => {
    set((state) => {
      // Clear all timeouts
      state.toastTimeouts.forEach(timeout => clearTimeout(timeout));
      return {
        notifications: [],
        toasts: [],
        unreadCount: 0,
        toastTimeouts: new Map(),
      };
    });
  },

  clearAllTimeouts: () => {
    set((state) => {
      // Clear all timeouts
      state.toastTimeouts.forEach(timeout => clearTimeout(timeout));
      return { toastTimeouts: new Map() };
    });
  },
}));
