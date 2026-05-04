# Data Model: Notification System

**Date**: 2026-05-03
**Feature**: Notification System

## Entities

### Notification

A single notification entry that is shared by both toast display and bell history.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique UUID generated on creation |
| type | NotificationType | Visual classification: `success`, `error`, `warning`, `info` |
| message | string | Human-readable message text |
| createdAt | Date | Timestamp when the notification was created |
| read | boolean | Whether the user has marked this notification as read |
| dismissed | boolean | Whether the toast has been visually dismissed (auto or manual) |
| dismissTimer | number \| null | `setTimeout` handle for auto-dismiss; cleared on manual dismiss |

### NotificationType

```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';
```

### NotificationStore (Zustand)

```typescript
interface NotificationState {
  notifications: Notification[];
}

interface NotificationActions {
  addNotification: (type: NotificationType, message: string) => string;
  dismissToast: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}
```

## State Transitions

1. **Trigger** → `addNotification()` creates a notification with `read: false`, `dismissed: false`, and starts a 4-second timer
2. **AutoDismiss** → Timer fires → `dismissed` becomes `true`; notification stays in history
3. **ManualDismiss** → User clicks X → timer is cleared, `dismissed` becomes `true`
4. **MarkAsRead** → User clicks a notification in the bell dropdown → `read` becomes `true`
5. **ClearAll** → All notifications are removed from the array; unread count resets to zero

## Derived Selectors (computed from store)

| Selector | Logic | Used By |
|----------|-------|---------|
| activeToasts | `notifications.filter(n => !n.dismissed)` | ToastContainer |
| unreadCount | `notifications.filter(n => !n.read).length` | Bell badge |
| recentNotifications | `notifications.slice(-10).reverse()` | Bell dropdown |

## Constraints

- Maximum 50 notifications stored in memory and localStorage at any time (oldest evicted on overflow)
- `dismissTimer` is stored in memory only (excluded from localStorage persistence; timers do not survive page reload)
- Bell dropdown displays at most 10 most recent notifications
- Toasts auto-dismiss after exactly 4 seconds from creation
- A notification that is already `read` can be marked `read` again with no effect (idempotent)
