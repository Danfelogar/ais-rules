# SPEC: Single-File Todo App

## 1. Objective

Build a genuinely useful todo app in under 200 lines of React + TypeScript in a single `.tsx` file. The app proves that mastery of fundamentals beats dependency bloat. It serves as both a personal tool and a portfolio piece demonstrating restraint and deep understanding of React basics.

**Target users:** The developer (personal use) and potential employers/clients reviewing the portfolio.

**Success criteria:**
- Single `App.tsx` file under 200 lines (measured by `wc -l`, excluding config files)
- All MVP features working without bugs
- Fully keyboard-accessible (tab, enter, escape, delete shortcuts)
- Persists state to localStorage across page reloads
- Zero runtime dependencies beyond React

---

## 2. Commands

No custom CLI commands. Use standard Vite + React scripts:

```bash
npm create vite@latest . -- --template react-ts  # initial scaffold
npm install                                      # install dependencies
npm run dev                                      # start dev server
npm run build                                    # production build
npm run typecheck                                # TypeScript type checking
```

---

## 3. Project Structure

```
single-file-todo/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── SPEC.md                    # This file
├── .claude/
│   └── docs/
│       └── ideas/
│           └── single-file-todo.md  # Source idea doc
└── src/
    ├── main.tsx              # Entry point (Vite scaffold, ~10 lines)
    ├── App.tsx               # THE single file — all app logic here (~200 lines)
    └── vite-env.d.ts        # Vite type declarations (auto-generated)
```

**Key constraint:** All application logic lives in `src/App.tsx`. No extraction of components, hooks, or utilities to separate files. `main.tsx` stays as the Vite scaffold only.

---

## 4. Code Style

### Language & Framework
- **React 18+** with **TypeScript strict mode**
- No external libraries beyond React (no Zustand, Redux, Tailwind, etc.)
- No CSS frameworks — all styling via inline `style` objects

### State Management
- **`useReducer`** for todo state management (not `useState` with object state)
- Action types defined as a union type inline
- State shape: `{ todos: Todo[], filter: Filter }`

### Types (all inline in App.tsx)
```ts
type Todo = {
  id: string
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

type Action =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'SET_FILTER'; filter: Filter }
  | { type: 'CLEAR_COMPLETED' }
```

### Styling
- Inline `style` objects defined as constants at the top of the component
- Basic responsive layout (max-width container, centered)
- Visual feedback for completed items (strikethrough, muted color)
- Focus styles for keyboard accessibility

### Line Limit
- **Target:** Under 200 lines in `src/App.tsx`
- Measurement: `wc -l src/App.tsx` (blank lines count, comments count)
- Type definitions count toward the limit
- If approaching 200, remove features — not lines of code

### localStorage
- **Key:** Hardcoded to `"todos"` (not configurable)
- Read on mount via `useEffect`
- Write on every state change (debounced or direct — simplicity over optimization)
- Handle JSON parse errors gracefully (fallback to empty array)

---

## 5. Testing Strategy

**No automated tests.** The single-file constraint makes unit testing awkward without extracting code.

**Manual verification checklist (run before considering complete):**
- [ ] Can add a todo via input + Enter key
- [ ] Can add a todo via input + click button
- [ ] Can toggle todo complete via click
- [ ] Can toggle todo complete via keyboard (tab + space)
- [ ] Can delete todo via button
- [ ] Can delete todo via keyboard shortcut (e.g., select + delete)
- [ ] Filter buttons switch between All / Active / Completed
- [ ] "Clear completed" removes only completed todos
- [ ] Todos persist after page reload
- [ ] Tab navigation follows logical order
- [ ] Focus is visible on all interactive elements
- [ ] App renders correctly at 375px (mobile) and 1024px (desktop) widths

---

## 6. Boundaries

### Always Do
- Keep all app logic in a single `App.tsx` file
- Use `useReducer` for state management (not external libraries)
- Define TypeScript types inline (no separate `types.ts`)
- Persist to localStorage on every state change
- Ensure keyboard accessibility (tab order, focus management)
- Count lines with `wc -l src/App.tsx` — stay under 200

### Ask First About
- Extracting any code to a separate file (even types or utilities)
- Adding a CSS file instead of inline styles
- Adding any npm dependency (even small ones like `uuid`)
- Increasing the line limit beyond 200
- Adding features from the "Out" list (edit, drag-and-drop, due dates, etc.)

### Never Do
- Use external state management libraries (Zustand, Redux, MobX, etc.)
- Use CSS frameworks (Tailwind, styled-components, emotion, etc.)
- Extract components (`TodoItem`, `FilterBar`, `TodoInput`, etc.)
- Add animations or transitions
- Implement edit-in-place for todos
- Support multiple lists or tags
- Add dark mode toggle
- Use `eval`, `Function` constructor, or other unsafe patterns
- Store todos in any format other than JSON in localStorage

---

## Appendix: Feature Acceptance Criteria

### Add Todo
- Input field with placeholder text
- Pressing Enter or clicking "Add" button adds the todo
- Input clears after adding
- Empty or whitespace-only input is rejected (no-op)
- Generates a simple unique ID (e.g., `Date.now().toString()`)

### Toggle Complete
- Clicking the todo text or a checkbox toggles completed status
- Completed todos show strikethrough and muted text color
- Keyboard: tab to todo, press Space to toggle

### Delete Todo
- Each todo has a delete button (×)
- Clicking × removes the todo
- Keyboard: tab to delete button, press Enter to remove

### Filter
- Three buttons: All / Active / Completed
- Active filter shows only incomplete todos
- Completed filter shows only completed todos
- Active filter button is visually highlighted

### Clear Completed
- Button appears only when there are completed todos
- Clicking removes all completed todos at once
- Button hides when no completed todos exist

### Persistence
- On mount: read `"todos"` from localStorage, parse JSON, populate state
- On change: serialize todos array to JSON, write to `"todos"` in localStorage
- Invalid JSON in localStorage falls back to empty array (no crash)
