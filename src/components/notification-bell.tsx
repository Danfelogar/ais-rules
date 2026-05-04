import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotificationStore } from '@/stores/notification-store'
import { NotificationDropdown } from './notification-dropdown'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const unreadCount = useNotificationStore((s) =>
    s.notifications.filter((n) => !n.read).length
  )

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />

        {unreadCount > 0 && (
          <>
            {/* Unread dot */}
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" aria-hidden="true" />
            {/* Numeric badge */}
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        )}
      </button>

      <NotificationDropdown open={open} />

      {/* Close on outside click */}
      {open && (
        <div
          className="fixed inset-0 z-10"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}
