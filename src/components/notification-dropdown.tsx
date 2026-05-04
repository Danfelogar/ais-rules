import { Inbox, Trash2 } from 'lucide-react'
import { useRelativeTimestamp } from '@/hooks/use-relative-timestamp'
import { useNotificationStore } from '@/stores/notification-store'
import type { Notification } from '@/types/notification'

function NotificationRow({ n }: { n: Notification }) {
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const relativeTime = useRelativeTimestamp(n.createdAt)

  return (
    <button
      type="button"
      onClick={() => markAsRead(n.id)}
      className={[
        'flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-gray-100',
        n.read ? 'opacity-75' : '',
      ].join(' ')}
      aria-label={n.read ? 'Notification' : 'Unread notification'}
    >
      {!n.read && (
        <span className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
      )}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-gray-900">{n.message}</p>
        <p className="text-xs text-gray-500">{relativeTime}</p>
      </div>
    </button>
  )
}

export function NotificationDropdown({ open }: { open: boolean }) {
  const notifications = useNotificationStore((s) => s.notifications)
  const recent = notifications.slice().reverse().slice(0, 10)
  const clearAll = useNotificationStore((s) => s.clearAll)

  if (!open) return null

  return (
    <div
      className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl"
      role="dialog"
      aria-label="Notifications dropdown"
      onKeyDown={(e) => e.key === 'Escape' && open}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        {recent.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-10 text-gray-400">
          <Inbox className="h-10 w-10" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-sm">No notifications</p>
        </div>
      ) : (
        <div className="max-h-72 divide-y divide-gray-100 overflow-y-auto py-1">
          {recent.map((n) => (
            <NotificationRow key={n.id} n={n} />
          ))}
        </div>
      )}
    </div>
  )
}
