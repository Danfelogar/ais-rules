import { createPortal } from 'react-dom'
import { useNotificationStore } from '@/stores/notification-store'
import { Toast } from './toast'

import { useMemo } from 'react'

export function ToastContainer() {
  const notifications = useNotificationStore((s) => s.notifications)
  const dismissToast = useNotificationStore((s) => s.dismissToast)

  const toasts = useMemo(() => {
    return notifications.filter((n) => !n.dismissed)
  }, [notifications])

  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          id={t.id}
          type={t.type}
          message={t.message}
          onDismiss={dismissToast}
        />
      ))}
    </div>,
    document.body
  )
}