# Implementation Plan: Notification System

**Branch**: `002-notification-system` | **Date**: 2026-05-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-notification-system/spec.md`

## Summary

Add a global notification system with two surfaces: ephemeral toast notifications in the bottom-right corner, and a persistent notification bell dropdown in the top navigation. Toasts and bell share the same Zustand-backed notification list. Toasts auto-dismiss after 4 seconds or can be manually dismissed; the bell retains the full history (last 10 shown) with unread counts, read/unread toggles, and a clear-all action. Built entirely with custom Zustand logic (no external toast library), shadcn/ui primitives, Tailwind CSS animations, and date-fns for relative timestamps.

## Technical Context

**Language/Version**: TypeScript ~6.0.2 (strict mode)  
**Primary Dependencies**: Vite, React 19, Zustand, Tailwind CSS v4, shadcn/ui, date-fns  
**Storage**: localStorage via Zustand persist middleware (key: `notification-store`)  
**Testing**: Vitest + React Testing Library (project default)  
**Target Platform**: Web (desktop browsers; mobile responsiveness deferred to v1)  
**Project Type**: Single-page web application (client-side only)  
**Performance Goals**: Toast appears within 1 render frame; dropdown renders in <50ms with up to 10 items  
**Constraints**: No external toast library; React portal required for toast overlay; auto-dismiss timer must be cleaned up on manual dismiss  
**Scale/Scope**: Single-user session; max 50 notifications stored in memory and localStorage; max 10 shown in dropdown  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

- [x] TypeScript strict mode is not relaxed (Principle I)
- [x] React 18+ functional components only, no class components (Principle II)
- [x] shadcn/ui + Tailwind CSS for all UI work (Principle III)
- [x] Zustand for global state, local state for component-only (Principle IV)
- [x] TanStack Query for all async data fetching (Principle V) — **N/A for this feature** (no server data fetching; purely client-managed notification state)
- [x] Components remain under 150 lines with single responsibility (Principle VI)
- [x] Naming conventions: PascalCase components, camelCase hooks/utils, kebab-case files (Principle VII)
- [x] Feature spec exists and is approved before implementation (Principle VIII)

**Constitution Check Result**: PASSED — all applicable principles satisfied. N/A items are documented and justified. No complexity tracking needed.

**New Decisions Applied**:
- **localStorage persistence**: Enabled via Zustand persist middleware (key: `notification-store`) per spec update.
- **`dismissTimer` in contract**: Added to store-contract `Notification` interface.
- **Empty state**: Bell dropdown shows an icon + "No notifications" text when history is empty.
- **Read/unread dot**: Each dropdown row uses a blue dot indicator for unread; read rows appear without the dot.
- **Keyboard accessibility**: Tab/Enter/Escape handling explicitly required for all interactive elements.
- **Mobile responsiveness**: Explicitly deferred to a v1 follow-up; current layout targets desktop viewports.

## Project Structure

### Documentation (this feature)

```text
specs/002-notification-system/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── store-contract.md
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── toast-container.tsx       # Portal-mounted fixed container (bottom-right)
│   ├── toast.tsx                 # Individual toast item with type icon + dismiss
│   ├── notification-bell.tsx     # Bell button with badge + popover trigger
│   └── notification-dropdown.tsx # Popover content: list, mark-read, clear-all
├── stores/
│   ├── favorites-store.ts        # Existing
│   └── notification-store.ts     # New: Zustand store + actions (persisted to localStorage)
├── types/
│   └── notification.ts           # NotificationType + Notification interface
├── app.tsx
└── main.tsx
```

**Structure Decision**: Single-project Vite SPA. All new files follow existing conventions: components in `src/components/`, stores in `src/stores/`, shared types in `src/types/`.

## Research Findings

### No External Toast Library

Build toast rendering from scratch using Zustand + React portal. The feature is lightweight (4 types, auto-dismiss, manual dismiss, stacking), and a custom implementation avoids external bundle overhead while directly integrating with the shared notification state. See [research.md](research.md) for full rationale.

### Shared State for Toasts and Bell History

A single `Notification` entity drives both toasts (ephemeral) and bell dropdown (persistent). The store holds all notifications; a derived array of "active toasts" is computed by filtering out dismissed ones. `dismissToast` only marks a toast as visually dismissed; the notification remains in history until `clearAll`.

### Auto-Dismiss Timer in Store Action

Start `setTimeout` inside `addNotification`, store the timer handle on the notification object, and clear it on `dismissToast`. Centralized timer management prevents memory leaks from unmounting toast components before timers fire. React StrictMode double-mount/double-unmount is safe because the store outlives component renders.

### Portal for ToastContainer

Render `<ToastContainer />` inside a React portal attached to `document.body`. This avoids z-index wars and overflow clipping from ancestor containers, and keeps toast lifecycle independent of route or page-level unmounts.

### date-fns for Relative Timestamps

Use `date-fns` `formatDistanceToNow` for bell dropdown timestamps. It handles unit selection and pluralization in a single call. This is a new dependency (~2KB tree-shakeable) that must be installed during implementation.

### shadcn/ui Bell + Popover

**Decision**: Use shadcn/ui `button` + `popover` primitives for the notification bell and dropdown panel. Bell icon comes from `lucide-react` (already installed). `popover` chosen over `dropdown-menu` to allow richer content (timestamps, scrollable list, empty-state icon).

### Toast Positioning & Stacking

Fixed bottom-right corner via Tailwind `fixed bottom-4 right-4` with `flex-col-reverse` layout so newest toasts appear at the top of the stack. Slide-in animation from right uses Tailwind `translate-x-full` → `translate-x-0` transition.

### Notification Limit

Keep the last 50 notifications in the Zustand store (evict oldest on overflow); only the most recent 10 are rendered in the bell dropdown. `clearAll` resets the array to empty.

## Complexity Tracking

No constitutional violations detected. All decisions align with principles.
