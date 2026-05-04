# Quickstart: Notification System

**Date**: 2026-05-03
**Feature**: Notification System

## Setup

### Install Dependencies

```bash
# Install date-fns for relative timestamps
npm install date-fns

# Install shadcn/ui components (if not already available)
npx shadcn add button popover
```

Zustand and Tailwind CSS are already installed in the project.

### Mount ToastContainer

Add `<ToastContainer />` at the root of your application, rendered as a portal:

```tsx
// App.tsx
import { ToastContainer } from '@/components/toast-container'
import { NotificationBell } from '@/components/notification-bell'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-full flex-col">
        <header className="...">
          <h1>Pokemon Explorer</h1>
          <NotificationBell />
        </header>
        {/* ... rest of app ... */}
      </div>
      <ToastContainer />
    </QueryClientProvider>
  )
}
```

### Trigger Notifications

Import the store action anywhere in the app:

```tsx
import { useNotificationStore } from '@/stores/notification-store'

function SomeComponent() {
  const addNotification = useNotificationStore.getState().addNotification

  const handleSuccess = () => {
    addNotification('success', 'Pokemon added to favorites!')
  }

  const handleError = () => {
    addNotification('error', 'Failed to load Pokemon data.')
  }

  // ...
}
```

## Development Workflow

1. Run `npm run dev` to start Vite dev server
2. Open `http://localhost:5173`
3. Trigger notifications from UI actions to test toasts and bell integration

## Build

```bash
npm run build
```

No additional environment variables or build configuration required.
