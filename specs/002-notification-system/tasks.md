# Tasks: Notification System

**Input**: Design documents from `/specs/002-notification-system/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested; tasks are implementation-focused.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and shadcn/ui primitives needed by all user stories

- [X] T001 Install `date-fns` runtime dependency: `npm install date-fns`
- [X] T002 Install shadcn/ui `button` and `popover` primitives: `npx shadcn add button popover`

**Checkpoint**: Dependencies and primitives are installed; project builds cleanly.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared type layer and Zustand store that both user stories depend on

**Goal**: Notification types, store contract, and persistence must be in place before any UI component can be built.

- [X] T003 [P] Create `src/types/notification.ts` with `NotificationType` union and `Notification` interface (id, type, message, createdAt, read, dismissed, dismissTimer?)
- [X] T004 [P] Create `src/stores/notification-store.ts` with Zustand store exposing: notifications array, addNotification (returns id), dismissToast, markAsRead, clearAll. Use `persist` middleware with localStorage key `notification-store`; exclude `dismissTimer` from serialization. Cap array at 50 items (oldest evicted on overflow). Start 4-second auto-dismiss timer in addNotification; clear on dismissToast/clearAll.

**Checkpoint**: Store can be imported and actions exercised in isolation (e.g., `addNotification('info','test')` adds a persisted notification, `clearAll()` empties it).

---

## Phase 3: User Story 1 - Toast Notifications (Priority: P1) 🎯 MVP

**Goal**: Render ephemeral toast panels in the bottom-right corner. Each panel shows a message, visual type indicator, and an X dismiss button. Toasts auto-dismiss after 4 seconds, stack vertically, and animate in from the right.

**Independent Test**: Trigger a notification via the store and verify a toast appears in the bottom-right with the correct message and type icon. Wait 4 seconds and verify it disappears automatically. Trigger another and manually click the X before auto-dismiss. Verify multiple toasts stack vertically.

### Implementation for User Story 1

- [X] T005 [P] [US1] Create `src/components/toast.tsx` — single Toast component. Accepts `id`, `type`, `message`, `onDismiss`. Renders type icon ( success→CheckCircle, error→XCircle, warning→AlertTriangle, info→Info ), message text, and an X dismiss button. Uses Tailwind for type-based background/border colors. Keyboard: dismiss button is a native `<button>` (Tab/Enter already handled). Stay under 150 lines.
- [X] T006 [US1] Create `src/components/toast-container.tsx` — reads active toasts from `useNotificationStore`. Renders as a React portal into `document.body`. Container is `fixed bottom-4 right-4 flex flex-col-reverse gap-2`. Maps each active toast to `<Toast>` with `onDismiss` wired to `dismissToast`.
- [X] T007 [US1] Mount `<ToastContainer />` in `src/App.tsx` (inside the `QueryClientProvider`, preferably at the bottom level, outside the flex layout). Verify portal renders to body.
- [X] T008 [P] [US1] Add CSS/Tailwind slide-in animation for toast entry: `transition-transform duration-300 ease-out` from `translate-x-full` to `translate-x-0`.

**Checkpoint**: At this point, calling `addNotification()` anywhere in the app should show a stacked toast in the bottom-right. Manual dismiss and auto-dismiss both work. This is the MVP.

---

## Phase 4: User Story 2 - Notification Bell and Dropdown Panel (Priority: P2)

**Goal**: Bell icon in the top navigation shows an unread dot and numeric badge (when >0). Clicking opens a shadcn/ui Popover with up to 10 recent notifications, each showing type icon, message, relative timestamp, and unread dot. Clicking a row marks it read. A "Clear all" button empties everything.

**Independent Test**: Click the bell: dropdown appears. Verify badge shows unread count. Verify up to 10 notifications with type icons, messages, and relative timestamps. Click a notification row: unread count decreases. Click "Clear all": list empties, badge disappears.

### Implementation for User Story 2

- [X] T010 [P] [US2] Create `src/components/notification-dropdown.tsx` — Popover content panel. Reads `recentNotifications` (max 10, newest first) from the store. Renders: (a) dropdown header with "Notifications" title and "Clear all" destructive button, (b) scrollable list of `<NotificationRow>` items, (c) empty state with `Inbox` icon + "No notifications" text when list is empty. Each row shows type icon, message text, relative timestamp via `formatDistanceToNow`, and a blue dot for unread. Clicking a row calls `markAsRead(id)`.
- [X] T011 [US2] Create `src/components/notification-bell.tsx` — shadcn/ui Button using `lucide-react` `Bell` icon. Wraps `Popover` (trigger = this button). Shows: (a) numeric badge when `unreadCount > 0`, (b) unread dot indicator when `unreadCount > 0`. Badge hides when count is zero.
- [X] T012 [US2] Mount `<NotificationBell />` in `src/App.tsx` inside the `<header>` element (next to the `<h1>` title).
- [X] T013 [P] [US2] Create `src/hooks/use-relative-timestamp.ts` — custom hook that re-computes the relative timestamp display every 30 seconds using `formatDistanceToNow`. Used by each notification row in the dropdown.
- [X] T014 [P] [US2] Wire keyboard accessibility: update `notification-dropdown.tsx` so the "Clear all" button and each notification row are focusable via Tab, activatable via Enter, and the Popover closes on Escape (shadcn/ui Popover provides most of this; verify focus trap works).

**Checkpoint**: Bell is visible in the header. Badge count reflects unread notifications. Dropdown shows history with timestamps, unread dots, and empty state. Mark-read and clear-all both update the badge correctly.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Add trigger points in existing app UI so the notification system is actually exercised by real user actions. Verify integration.

- [X] T015 Wire toast triggers into existing app actions:
  - In `src/components/pokemon-card.tsx`: trigger `addNotification('success', 'Added to favorites')` when adding a favorite; trigger `addNotification('info', 'Removed from favorites')` when removing.
  - In `src/App.tsx`: trigger `addNotification('error', 'Failed to load Pokemon data')` when `isError` is true in `usePokemonSearch`.
- [X] T016 Validate keyboard accessibility end-to-end: Tab through header (bell → dismiss button inside dropdown → clear-all → notification rows), press Enter to activate, press Escape to close dropdown. No custom keyboard trap violations.
- [X] T017 Verify localStorage persistence: add notifications, reload the page, confirm bell dropdown still shows history and unread state. Confirm `dismissTimer` is NOT present in localStorage serialized JSON.
- [X] T018 Verify plan quickstart steps: run `npm run dev`, open app, trigger toasts from existing UI actions, confirm bottom-right display, bell badge increments, dropdown works.

**Checkpoint**: The notification system is fully integrated into the Pokemon Explorer app. Toasts trigger from real app actions. History persists across reloads. Keyboard navigation works for all interactive surfaces.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (npm packages installed) — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 (notification-store exists)
- **Phase 4 (US2)**: Depends on Phase 2 (notification-store exists) AND Phase 3 (ToastContainer mounted, though technically optional; prefer sequential for single-developer context)
- **Phase 5 (Polish)**: Depends on Phase 3 and Phase 4 complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2. No dependencies on US2.
- **User Story 2 (P2)**: Can start after Phase 2. Reads the same store as US1; no code dependency but logically follows US1.

### Within Each Phase

- Phase 1 tasks are sequential (one npm command at a time)
- Phase 2 tasks can run in parallel (T003 and T004 touch different files)
- Phase 3: T005 and T008 are [P]; T006 depends on T005; T007 depends on T006
- Phase 4: T010 and T011 are [P] (different files); T012 depends on T011; T013 is independent [P]; T014 depends on T010/T011
- Phase 5: T015 touches multiple existing files (sequential recommended); T016-T018 are verification steps (sequential)

### Parallel Opportunities

- Phase 2: T003 and T004 can be done in parallel
- Phase 3: T005 and T008 in parallel
- Phase 4: T010 and T011 and T013 in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Trigger toasts from a test harness or temporary button. Verify stacking, auto-dismiss, and manual dismiss.
5. Proceed to Phase 4: User Story 2 once US1 is solid.

### Incremental Delivery

1. Setup + Foundational → Store ready
2. Add US1 → Toast system works end-to-end → Deployable increment
3. Add US2 → Bell dropdown works → Complete feature
4. Add Phase 5 polish → Integrated with real app actions → Production-ready

---

## Metrics

| Metric | Value |
|--------|-------|
| Total tasks | 18 |
| Tasks in Phase 1 | 2 |
| Tasks in Phase 2 | 2 |
| Tasks in Phase 3 (US1) | 4 |
| Tasks in Phase 4 (US2) | 4 |
| Tasks in Phase 5 (Polish) | 4 |
| Parallelizable tasks | 7 |
