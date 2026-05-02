# Single-File Todo App

## Problem Statement
How might we build a genuinely useful todo app in under 200 lines of React + TypeScript — proving that mastery of fundamentals beats dependency bloat?

## Recommended Direction
A single `.tsx` file containing a complete, keyboard-first todo app persisted to localStorage. No external state libraries, no CSS frameworks, no component extraction — just disciplined use of `useReducer`, inline styles, and strict TypeScript.

The app supports: add, complete, delete, filter (all/active/completed), and clear completed. Every interaction is keyboard-accessible. The entire thing fits in 200 lines because every line earns its place.

This serves dual purpose: a personal tool you fully understand, and a portfolio piece that demonstrates restraint — which is harder than it looks.

## Key Assumptions to Validate
- [ ] 200 lines is sufficient for a *useful* app — build it and use it for 2 days
- [ ] Inline styles are acceptable for a portfolio piece — ask 1-2 developers for feedback
- [ ] Keyboard-only interaction feels fast, not frustrating — measure by daily use
- [ ] Single file remains readable — if adding a feature feels painful, the constraint may be wrong

## MVP Scope

**In:**
- Add todo (Enter key + button)
- Toggle complete (click or keyboard)
- Delete todo (keyboard shortcut or button)
- Filter: All / Active / Completed
- Clear completed
- localStorage persistence (read on mount, write on change)
- TypeScript strict mode — all types defined inline
- Keyboard accessibility (tab order, focus management)
- Basic responsive layout via inline styles

**Out (add later only if needed):**
- Edit todo inline
- Drag-and-drop reordering
- Due dates or priorities
- Tags or projects
- Dark mode toggle
- Search/fuzzy filter
- Multiple lists
- Animations or transitions

## Not Doing (and Why)
- **No component extraction** — the single-file constraint means no separate `TodoItem.tsx` or `FilterBar.tsx`. This forces clarity in a single render function.
- **No external libraries (Zustand, Redux, etc.)** — `useReducer` is sufficient and teaches more about state shape.
- **No CSS framework (Tailwind, styled-components)** — inline styles keep everything in one file and avoid build complexity.
- **No animations/transitions** — they add lines fast and distract from the "small + correct" story.
- **No edit-in-place** — adds significant complexity (focus management, escape-to-cancel, etc.) for marginal value.

## Open Questions
- Should localStorage key be configurable, or hardcoded to `"todos"`?
- Should the 200-line limit include TypeScript type definitions, or just runtime code?
- Is `useReducer` + `dispatch` the right mental model, or is `useState` with object state simpler for this scale?
