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
}

type NotificationStore = NotificationStoreState & NotificationStoreActions;

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  toasts: [],
  unreadCount: 0,

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
      }));
    }, 3000);

    return () => clearTimeout(timeoutId);
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
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
    set({
      notifications: [],
      toasts: [],
      unreadCount: 0,
    });
  },
}));
