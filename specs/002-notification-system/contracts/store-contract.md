# Store Contract: Notification System

**Date**: 2026-05-03
**Feature**: Notification System

## Internal Contracts

### useNotificationStore

```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: Date;
  read: boolean;
  dismissed: boolean;
  /** SetTimeout handle for auto-dismiss. Memory-only: excluded from localStorage persistence. */
  dismissTimer?: number | null;
}

interface NotificationActions {
  /** Add a new notification and show its toast. Starts a 4-second auto-dismiss timer. Returns the generated notification ID. */
  addNotification: (type: NotificationType, message: string) => string;

  /** Mark a toast as dismissed (visually removed). Clears its pending auto-dismiss timer. */
  dismissToast: (id: string) => void;

  /** Mark a single notification as read. Does nothing if already read. */
  markAsRead: (id: string) => void;

  /** Remove all notifications, reset unread count to zero, and cancel all pending auto-dismiss timers. */
  clearAll: () => void;
}

interface NotificationStore extends NotificationActions {
  notifications: Notification[];
}

declare const useNotificationStore: import('zustand').UseBoundStore<
  import('zustand').StoreApi<NotificationStore>
>;
```

### ToastContainer Props

```typescript
interface ToastContainerProps {
  // No external props — all state driven by the Zustand store
}
```

### NotificationBell Props

```typescript
interface NotificationBellProps {
  // No external props — all state driven by the Zustand store
}
```

### Toast Props (internal)

```typescript
interface ToastProps {
  id: string;
  type: NotificationType;
  message: string;
  onDismiss: (id: string) => void;
}
```

## Component Hierarchy

```
App (root)
├── NotificationBell          # shadcn/ui Button + Popover
│   └── NotificationDropdown  # List of up to 10 recent notifications
└── ToastContainer (Portal → document.body)
    └── Toast[]               # Active toasts, stacked bottom-right
```

## Event Flow

```text
User action / system event
    │
    ▼
addNotification(type, message)
    │
    ├──► Notification added to store (read=false, dismissed=false)
    │
    ├──► setTimeout(4000) → dismissToast(id)
    │
    ├──► ToastContainer re-renders → new Toast appears
    │
    └──► NotificationBell badge increments

User clicks X on Toast
    │
    ▼
dismissToast(id)
    │
    ├──► clearTimeout(timer) if pending
    │
    └──► dismissed=true → Toast removed from active list

User clicks Bell
    │
    ▼
Popover opens showing recentNotifications
    │
    ▼
User clicks a notification row
    │
    ▼
markAsRead(id)
    │
    └──► read=true → badge count decrements

User clicks "Clear all"
    │
    ▼
clearAll()
    │
    ├──► notifications=[]
    │
    ├──► All pending setTimeout timers cleared
    │
    └──► Badge count = 0
```
