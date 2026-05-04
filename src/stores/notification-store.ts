import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification, NotificationType } from '@/types/notification'

interface NotificationState {
  notifications: Notification[]
}

interface NotificationActions {
  addNotification: (type: NotificationType, message: string) => string
  dismissToast: (id: string) => void
  markAsRead: (id: string) => void
  clearAll: () => void
}

export type NotificationStore = NotificationState & NotificationActions

const STORAGE_LIMIT = 50

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (type, message) => {
        const id = crypto.randomUUID()
        const prev = get().notifications

        const dismissTimer = setTimeout(() => {
          get().dismissToast(id)
        }, 4000)

        const evicted = prev.length >= STORAGE_LIMIT
          ? prev.slice(-(STORAGE_LIMIT - 1))
          : prev

        set({
          notifications: [
            ...evicted,
            {
              id,
              type,
              message,
              createdAt: new Date(),
              read: false,
              dismissed: false,
              dismissTimer,
            },
          ],
        })

        return id
      },

      dismissToast: (id) => {
        set({
          notifications: get().notifications.map((n) => {
            if (n.id === id && !n.dismissed) {
              if (n.dismissTimer) clearTimeout(n.dismissTimer)
              return {
                ...n,
                dismissed: true,
                dismissTimer: null,
              }
            }
            return n
          }),
        })
      },

      markAsRead: (id) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })
      },

      clearAll: () => {
        get().notifications.forEach((n) => {
          if (n.dismissTimer) clearTimeout(n.dismissTimer)
        })
        set({ notifications: [] })
      },
    }),
    {
      name: 'notification-store',
      version: 1,
      partialize: (state) => ({
        notifications: state.notifications
          .filter((n) => !n.dismissed || n.read)
          .map(({ dismissTimer, ...rest }) => rest),
      }),
      merge: (persisted, current) => {
        const p = persisted as Record<string, unknown>
        const raw = (p.notifications ?? []) as Array<{
          id: string
          type: NotificationType
          message: string
          createdAt: string
          read: boolean
          dismissed: boolean
        }>

        const restored: Notification[] = raw.map((n) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          dismissed: true,
          dismissTimer: null,
        }))

        return { ...current, notifications: restored }
      },
    }
  )
)
