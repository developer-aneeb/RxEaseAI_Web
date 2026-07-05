import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      isSidebarOpen: false,
      settings: {
        notificationsEnabled: true,
        autoAnalyze: true,
        mfaEnabled: false
      },
      notifications: [],
      toasts: [],

      // Sidebar actions
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

      // Settings actions
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      // Notifications actions
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
          },
          ...state.notifications
        ]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Toast actions (compatibility layer for ToastContext)
      showToast: (message, type = 'info') => set((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        return {
          toasts: [...state.toasts, { id, message, type }]
        };
      }),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }),
    {
      name: 'rxease-app-storage',
      partialize: (state) => ({
        settings: state.settings,
        notifications: state.notifications,
        isSidebarOpen: state.isSidebarOpen
      }),
    }
  )
);

export default useAppStore;
