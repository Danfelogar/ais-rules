# Plan: Break SPEC.md into Smallest Verifiable Tasks

## Context
The user requested breaking `.claude/specs/SPEC.md` (Single-File Todo App) into the smallest verifiable React component tasks, ordered by dependency. The SPEC enforces a **single `src/App.tsx` file under 200 lines** with no extracted components, so "component tasks" refer to incremental feature slices within the single App.tsx. All logic must use React+TypeScript only, with inline styles, `useReducer`, and localStorage persistence.

## Task Breakdown (Ordered by Dependency)
Each task is verifiable independently, with acceptance criteria and verification steps.

---

### Task 1: Scaffold Vite + React TypeScript Project
- **Dependencies**: None
- **Description**: Initialize the project using the Vite React-TS template, install dependencies.
- **Acceptance Criteria**:
  - Project scaffolded via `npm create vite@latest . -- --template react-ts`
  - `npm install` completes successfully
  - `src/App.tsx` exists (Vite scaffold default)
  - `src/main.tsx` exists as entry point
- **Verification**:
  - Run `npm run dev`, confirm dev server starts and loads at `localhost:5173`
  - Run `npm run typecheck`, confirm no TypeScript errors

---

### Task 2: Define Inline TypeScript Types in App.tsx
- **Dependencies**: Task 1 (App.tsx exists)
- **Description**: Add all required TypeScript type definitions inline in `src/App.tsx` as per SPEC.
- **Acceptance Criteria**:
  - `Todo` type: `{ id: string; text: string; completed: boolean }`
  - `Filter` type: `'all' | 'active' | 'completed'`
  - `Action` union type with all 5 action types (`ADD_TODO`, `TOGGLE_TODO`, `DELETE_TODO`, `SET_FILTER`, `CLEAR_COMPLETED`)
- **Verification**:
  - Run `npm run typecheck`, confirm no type errors
  - Line count check: `wc -l src/App.tsx` (should be ~30 lines for types + scaffold)

---

### Task 3: Implement useReducer State Management
- **Dependencies**: Task 2 (types defined)
- **Description**: Set up `useReducer` with initial state, reducer function, and all action handlers.
- **Acceptance Criteria**:
  - Reducer function handles all `Action` types correctly
  - Initial state: `{ todos: [], filter: 'all' }`
  - `useReducer` hook initialized in App component
- **Verification**:
  - Run `npm run typecheck`, confirm no errors
  - Add temporary test: dispatch `ADD_TODO` with dummy text, confirm state updates (check React DevTools or temp console log)

---

### Task 4: Add localStorage Persistence
- **Dependencies**: Task 3 (state shape and reducer finalized)
- **Description**: Read todos from localStorage on mount, write todos to localStorage on every state change.
- **Acceptance Criteria**:
  - Read: `useEffect` on mount reads `"todos"` from localStorage, parses JSON, populates state
  - Handle invalid JSON gracefully (fallback to empty array)
  - Write: `useEffect` triggered on `todos` change, serializes and writes to `"todos"` in localStorage
  - Hardcoded localStorage key: `"todos"`
- **Verification**:
  - Add a todo via temp dispatch, reload page: todo persists
  - Manually set invalid JSON in localStorage for `"todos"`, reload: app loads empty array (no crash)
  - Check localStorage after state change: `"todos"` key updated

---

### Task 5: Implement Add Todo Functionality
- **Dependencies**: Task 3 (ADD_TODO action exists)
- **Description**: Build input field and add logic with Enter key and Add button support.
- **Acceptance Criteria**:
  - Input field with placeholder text
  - Pressing Enter or clicking "Add" button dispatches `ADD_TODO` with input text
  - Input clears after adding
  - Empty/whitespace-only input is rejected (no-op)
  - ID generated via `Date.now().toString()`
- **Verification**:
  - Type "Test Todo", press Enter: todo appears in list
  - Type "  " (whitespace), click Add: no todo added
  - Add todo, reload page: persists (validates Task 4 works)
  - Line count check: `wc -l src/App.tsx` (should be under 80 lines)

---

### Task 6: Render Todo List with Toggle and Delete
- **Dependencies**: Task 5 (todos can be added)
- **Description**: Render the list of todos with toggle complete and delete buttons.
- **Acceptance Criteria**:
  - Each todo displays text and a delete button (×)
  - Clicking todo text/checkbox toggles `completed` status
  - Completed todos show strikethrough and muted text color (inline style)
  - Clicking × dispatches `DELETE_TODO`
- **Verification**:
  - Add 2 todos, toggle one: strikethrough appears
  - Click × on a todo: it is removed from list
  - Reload page: remaining todos persist

---

### Task 7: Implement Filter Buttons (All/Active/Completed)
- **Dependencies**: Task 6 (todo list renders), Task 3 (SET_FILTER action, filter state)
- **Description**: Add filter buttons to switch between todo views.
- **Acceptance Criteria**:
  - Three buttons: All / Active / Completed
  - Clicking a button dispatches `SET_FILTER` with the correct filter
  - Active filter button is visually highlighted (inline style)
  - Todo list filters correctly based on current `filter` and `completed` status
- **Verification**:
  - Add 2 active, 1 completed todo
  - Click "Active": only 2 active todos show
  - Click "Completed": only 1 completed todo shows
  - Click "All": all 3 todos show
  - Active filter button has distinct style

---

### Task 8: Implement Clear Completed Button
- **Dependencies**: Task 6 (completed todos exist), Task 3 (CLEAR_COMPLETED action)
- **Description**: Add button to remove all completed todos at once.
- **Acceptance Criteria**:
  - Button appears only when there are completed todos
  - Clicking button dispatches `CLEAR_COMPLETED`
  - Button hides when no completed todos exist
- **Verification**:
  - Add 2 completed todos, 1 active: Clear Completed button visible
  - Click button: only active todo remains
  - Button hides after clearing

---

### Task 9: Add Keyboard Accessibility
- **Dependencies**: Tasks 5-8 (all interactive elements exist)
- **Description**: Ensure full keyboard navigation and shortcuts.
- **Acceptance Criteria**:
  - Tab key navigates all interactive elements in logical order
  - Space key toggles todo complete (when todo is focused)
  - Enter key triggers buttons (Add, Delete, Filter, Clear Completed)
  - Delete key removes focused todo (optional shortcut)
  - Focus styles visible on all interactive elements (inline style)
- **Verification**:
  - Use only keyboard to: add todo, toggle complete, delete todo, switch filters, clear completed
  - Check focus rings are visible during tab navigation
  - Verify no interactive element is unreachable via keyboard

---

### Task 10: Apply Inline Styles & Verify Line Count
- **Dependencies**: Tasks 2-9 (all functionality implemented)
- **Description**: Add all inline style objects and ensure App.tsx stays under 200 lines.
- **Acceptance Criteria**:
  - Inline `style` objects defined as constants at top of component
  - Basic responsive layout (max-width container, centered)
  - Visual feedback for completed items (strikethrough, muted color)
  - `wc -l src/App.tsx` returns under 200 lines
  - No CSS files added (all styles inline)
- **Verification**:
  - Run `wc -l src/App.tsx`, confirm <200 lines
  - Check layout at 375px (mobile) and 1024px (desktop) widths
  - Confirm no external CSS frameworks or files used
  - Run full manual verification checklist from SPEC section 5

---

## Checkpoints Between Phases
1. **After Task 1**: Project scaffold ready, dev server running
2. **After Task 4**: State management and persistence working
3. **After Task 8**: All MVP features implemented
4. **After Task 10**: Final polish, line count verified, ready for release

## Critical Files
- `src/App.tsx`: All application logic (target <200 lines)
- `src/main.tsx`: Vite entry point (unchanged from scaffold)
- `.claude/specs/SPEC.md`: Source specification

## Verification (End-to-End)
Run the full manual checklist from SPEC section 5:
- [ ] Add todo via Enter/click
- [ ] Toggle todo via click/keyboard
- [ ] Delete todo via click/keyboard
- [ ] Filter switches correctly
- [ ] Clear completed works
- [ ] Persistence across reload
- [ ] Keyboard accessibility
- [ ] Responsive layout
- [ ] Line count <200
