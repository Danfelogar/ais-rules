# Research: Notification System

**Date**: 2026-05-03
**Feature**: Notification System

## Decisions

### No External Toast Library

**Decision**: Build toast rendering from scratch using Zustand + React portal instead of importing react-hot-toast, sonner, or react-toastify.

**Rationale**:
- The feature is intentionally lightweight (4 types, auto-dismiss, manual dismiss, stacking)
- A custom implementation avoids ~5–10KB of external bundle size for functionality that is trivial to express with Zustand and a portal
- Direct Zustand integration means toasts and notification history share the same state shape with zero adapter code
- The spec mandates "No external toast library"

**Alternatives considered**:
- `sonner` (shadcn/ui ecosystem) — rejected because spec explicitly rules out external toast libraries
- `react-hot-toast` / `react-toastify` — rejected for same reason

---

### Shared State for Toasts and Bell History

**Decision**: A single `Notification` entity drives both toasts (ephemeral) and bell dropdown (persistent). The store holds all notifications; a derived array of "active toasts" is computed by filtering out dismissed ones.

**Rationale**:
- Prevents data duplication and drift between toast list and bell history
- `dismissToast` only marks a toast as visually dismissed; the notification remains in history until `clearAll` or explicit removal
- Auto-dismiss timer lives in the store action, not inside each component, making cleanup predictable

**Alternatives considered**:
- Separate `toastStore` and `notificationStore` — rejected because both represent the same event stream and duplicating state complicates `clearAll` synchronization

---

### Portal for ToastContainer

**Decision**: Render `<ToastContainer />` inside a React portal attached to `document.body`.

**Rationale**:
- Toasts must float above all other UI layers regardless of where the triggering component lives in the tree
- Using a portal avoids z-index wars and overflow clipping from ancestor containers (e.g., `overflow-hidden` on a layout div)
- Mounting at the root keeps toast lifecycle independent of route or page-level unmounts

**Alternatives considered**:
- Fixed-position container inside `App.tsx` — rejected because ancestor `overflow` or `transform` can create new stacking contexts and clip the toast

---

### Auto-Dismiss Timer in Store Action

**Decision**: Start `setTimeout` inside `addNotification`, store the timer handle on the notification object, and clear it on `dismissToast`.

**Rationale**:
- Centralized timer management prevents memory leaks from unmounting toast components before timers fire
- If a toast is manually dismissed, clearing the timeout avoids a "zombie" dismiss call that could affect the wrong notification
- React StrictMode double-mount/double-unmount does not create orphaned timers because the store outlives component renders

**Alternatives considered**:
- `useEffect` timer inside each `Toast` component — rejected because React StrictMode can mount/unmount twice, creating duplicate timers and race conditions

---

### date-fns for Relative Timestamps

**Decision**: Use `date-fns` `formatDistanceToNow` for bell dropdown timestamps.

**Rationale**:
- Intl.RelativeTimeFormat requires manual interval selection and pluralization rules; `formatDistanceToNow` handles this with a single call
- The project does not currently ship `date-fns`, but it is a small, tree-shakeable dependency (~2KB for this single function)
- Consistent with spec mandate to use `date-fns`

**Alternatives considered**:
- `Intl.RelativeTimeFormat` — requires writing a wrapper to map seconds→best-fit unit; more code, no bundle savings after wrapper logic
- `dayjs` relativeTime plugin — rejected because user explicitly specified `date-fns`

---

### shadcn/ui Bell + Popover

**Decision**: Use shadcn/ui `button` + `popover` or `dropdown-menu` primitives for the notification bell and dropdown panel.

**Rationale**:
- shadcn/ui provides accessible keyboard handling, focus trapping, and positioning out of the box
- Constitution mandates shadcn/ui for all UI primitives
- Bell icon comes from `lucide-react` (already in project)

**Alternatives considered**:
- Custom div-based dropdown — rejected because it violates Principle III (must use shadcn/ui)

---

### Toast Positioning & Stacking

**Decision**: Fixed bottom-right corner via Tailwind `fixed bottom-4 right-4` with flex-col-reverse layout so newest toasts appear at the top of the stack. Mobile responsiveness for toast width and bell dropdown is deferred to a v1 follow-up.

**Rationale**:
- Matches the spec requirement (bottom-right)
- `flex-col-reverse` with `gap-2` gives natural vertical stacking without manual offset math
- slide-in animation from right uses Tailwind `translate-x-full` → `translate-x-0` transition
- Mobile layout (safe-area insets, narrower toast width, full-width dropdown) is explicitly deferred to keep v1 scope bounded

---

### Notification Limit & Persistence

**Decision**: Keep the last 50 notifications in the Zustand store persisted to localStorage (key: `notification-store`); only display the most recent 10 in the bell dropdown. `dismissTimer` values are excluded from persistence.

**Rationale**:
- Unbounded arrays grow forever in a long-lived session and can impact render performance
- 50 is large enough to cover a typical usage session; 10 in the dropdown matches the spec exactly
- `clearAll` resets the array to empty
- localStorage persistence allows notification history to survive page reloads per spec update
- `dismissTimer` values are runtime-only and must not be serialized (stale timer handles after reload)

---

### Empty State & Visual Indicators

**Decision**: Bell dropdown shows a `Inbox` icon (lucide-react) + "No notifications" text when empty. Each notification row shows a blue dot for unread status; read rows lack the dot.

**Rationale**:
- Empty state prevents users from thinking the UI is broken
- Dot indicator is a lightweight, accessible visual cue that does not rely on color alone
- Aligns with spec FR-012 and FR-018

### Keyboard Accessibility

**Decision**: All interactive elements (dismiss button, bell trigger, notification rows, clear-all) support Tab navigation, Enter activation, and Escape to close the dropdown. shadcn/ui Popover handles focus trapping automatically.

**Rationale**:
- Meets WCAG 2.1 Level A keyboard accessibility requirements
- shadcn/ui Popover already implements focus trapping and `Escape` key handling
- Toast dismiss button is a standard button element (no extra keyboard handling needed beyond focus)

## External Resources

- `date-fns` docs: https://date-fns.org/docs/formatDistanceToNow
- shadcn/ui Popover: https://ui.shadcn.com/docs/components/popover
- React Portals: https://react.dev/reference/react-dom/createPortal
