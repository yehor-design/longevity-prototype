import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AppNotification, ToastVariant } from "@/types";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;

  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  removeNotification: (id: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (n) => {
        const notification: AppNotification = {
          ...n,
          id: `notif-${Date.now()}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set(
          (s) => ({
            notifications: [notification, ...s.notifications],
            unreadCount: s.unreadCount + 1,
          }),
          false,
          "notifications/add"
        );
      },

      removeNotification: (id) =>
        set(
          (s) => {
            const removed = s.notifications.find((n) => n.id === id);
            return {
              notifications: s.notifications.filter((n) => n.id !== id),
              unreadCount: removed && !removed.read
                ? Math.max(0, s.unreadCount - 1)
                : s.unreadCount,
            };
          },
          false,
          "notifications/remove"
        ),

      markAllRead: () =>
        set(
          (s) => ({
            notifications: s.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          }),
          false,
          "notifications/markAllRead"
        ),

      markRead: (id) =>
        set(
          (s) => ({
            notifications: s.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, s.unreadCount - 1),
          }),
          false,
          "notifications/markRead"
        ),

      clearAll: () =>
        set({ notifications: [], unreadCount: 0 }, false, "notifications/clearAll"),
    }),
    { name: "NotificationStore" }
  )
);

/** Sample notifications for prototype demos */
export const SAMPLE_NOTIFICATIONS: Array<Omit<AppNotification, "id" | "createdAt" | "read">> = [
  {
    title: "Questionnaire reminder",
    message: "You're 15% complete. Resume your health questionnaire.",
    variant: "info" as ToastVariant,
  },
  {
    title: "New test results available",
    message: "Your latest blood panel has been processed.",
    variant: "success" as ToastVariant,
  },
  {
    title: "Token balance low",
    message: "You have 73 tokens remaining. Purchase more to continue.",
    variant: "warning" as ToastVariant,
  },
];
