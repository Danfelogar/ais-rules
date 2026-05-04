export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  createdAt: Date
  read: boolean
  dismissed: boolean
  dismissTimer?: ReturnType<typeof setTimeout> | null
}