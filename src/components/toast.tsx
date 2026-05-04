import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { NotificationType } from '@/types/notification'

const typeStyles: Record<NotificationType, string> = {
  success: 'border-green-500 bg-green-50 text-green-800',
  error: 'border-red-500 bg-red-50 text-red-800',
  warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
  info: 'border-blue-500 bg-blue-50 text-blue-800',
}

const typeIcons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />,
  error: <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" aria-hidden="true" />,
  info: <Info className="h-5 w-5 text-blue-600" aria-hidden="true" />,
}

interface ToastProps {
  id: string
  type: NotificationType
  message: string
  onDismiss: (id: string) => void
}

export function Toast({ id, type, message, onDismiss }: ToastProps) {
  const [entering, setEntering] = useState(true)

  useEffect(() => {
    const t = requestAnimationFrame(() => setEntering(false))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      data-testid="toast"
      role="alert"
      aria-live="assertive"
      className={[
        'pointer-events-auto flex w-80 items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-out',
        typeStyles[type],
        entering ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
      ].join(' ')}
    >
      <div className="mt-0.5 shrink-0">{typeIcons[type]}</div>
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="ml-2 -mr-1.5 -mt-1.5 inline-flex rounded-md p-1 text-gray-500 transition-colors hover:bg-black/5"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
