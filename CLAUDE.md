# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite single-page application that uses a **specification-first development workflow** governed by the **ais-rules Constitution** (`.specify/memory/constitution.md`). The project follows strict architectural principles and uses SPECKIT (a specification kit) to manage feature development through structured phases.

### Current Features

1. **Pokemon Explorer** (`specs/001-pokemon-explorer/`) - Complete feature
   - Search and browse Pokemon from PokeAPI
   - View detailed Pokemon information
   - Manage favorite Pokemon (persisted to localStorage)

2. **Notification System** (`specs/002-notification-system/`) - Active development
   - Toast notifications (bottom-right, auto-dismiss after 4s)
   - Notification bell with dropdown showing last 10 notifications
   - Shared Zustand store with localStorage persistence

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript (strict mode) | ~6.0.2 |
| Framework | React | 19.2.5 |
| Build Tool | Vite | 8.0.10 |
| Components | shadcn/ui primitives | - |
| Styling | Tailwind CSS | 4.2.4 |
| Global State | Zustand | 5.0.12 |
| Data Fetching | TanStack Query | 5.100.9 |
| HTTP Client | native fetch | - |
| Date Utils | date-fns | 4.1.0 |
| Icons | lucide-react | 1.14.0 |
| Testing | Vitest + React Testing Library | - |

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Testing Commands (when configured)
```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Project Structure

```
.
├── src/
│   ├── components/          # React components (PascalCase, .tsx)
│   │   ├── toast-container.tsx
│   │   ├── toast.tsx
│   │   ├── notification-bell.tsx
│   │   ├── notification-dropdown.tsx
│   │   ├── search-bar.tsx
│   │   ├── pokemon-grid.tsx
│   │   ├── pokemon-card.tsx
│   │   ├── pokemon-detail.tsx
│   │   └── favorites-tab.tsx
│   ├── hooks/               # Custom hooks (camelCase, .ts/.tsx)
│   │   ├── use-pokemon-search.ts
│   │   ├── use-pokemon-detail.ts
│   │   └── use-relative-timestamp.ts
│   ├── stores/              # Zustand stores
│   │   ├── favorites-store.ts
│   │   └── notification-store.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── pokemon.ts
│   │   └── notification.ts
│   ├── lib/                 # Utilities and API clients
│   │   └── api-client.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── specs/                   # SPECKIT specifications (per feature)
│   ├── 001-pokemon-explorer/
│   └── 002-notification-system/
├── .specify/               # SPECKIT configuration and templates
│   ├── templates/
│   ├── memory/
│   │   └── constitution.md    # Project constitution (8 principles)
│   ├── integrations/
│   ├── extensions.yml
│   └── init-options.json
├── public/
├── package.json
├── tsconfig.json
├── tsconfig.app.json         # Strict TypeScript settings
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
├── CLAUDE.md                 # This file
└── README.md
```

## Naming Conventions (Constitution Principle VII)

- **Components**: PascalCase (`NotificationBell`, `ToastContainer`)
- **Hooks/Utilities**: camelCase (`usePokemonSearch`, `formatDate`)
- **Files**: kebab-case (`notification-store.ts`, `use-relative-timestamp.ts`)
- **Types/Interfaces**: PascalCase (`Notification`, `PokemonSummary`)
- **Constants**: UPPER_SNAKE_CASE (`STORAGE_LIMIT`, `UPDATE_INTERVAL`)

## SPECKIT Workflow

SPECKIT (Specification Kit) manages the feature development lifecycle. All new features MUST follow this workflow:

### Phase 0: Specify
```bash
/speckit-specify
```
Create an initial feature specification from a natural language description. The spec includes user stories, acceptance criteria, and success metrics. Must be approved before planning.

### Phase 1: Plan & Research
```bash
/speckit-plan
```
Generate an implementation plan, conduct research, create data models, and produce a quickstart guide. Performs constitution gate check.

### Phase 2: Tasks
```bash
/speckit-tasks
```
Generate an ordered, dependency-aware tasks.md file from the plan and other design artifacts.

### Phase 3: Implement
```bash
/speckit-implement
```
Execute all tasks in tasks.md sequentially, marking each complete as it finishes.

### Additional Commands
- `/speckit-constitution` - Create or update the constitution
- `/speckit-clarify` - Ask up to 5 targeted questions to underspecify a feature
- `/speckit-analyze` - Cross-artifact consistency analysis
- `/speckit-checklist` - Generate custom checklist
- `/speckit-git-*` - Git operations (branch creation, validation, commits)

### Development Cycle
1. Create a feature branch (auto-handled by SPECKIT hooks)
2. Run `/speckit-specify` with feature description
3. Get spec approval (review constitution compliance)
4. Run `/speckit-plan` to generate design artifacts
5. Run `/speckit-tasks` to create tasks.md
6. Implement tasks (can use `/speckit-implement` for automation)
7. SPECKIT auto-commits at major milestones (configurable)

## Constitution Principles (Must Follow)

1. **TypeScript**: Strict mode everywhere, no `any` types
2. **React**: Functional components only, no class components
3. **UI/styling**: shadcn/ui + Tailwind CSS only
4. **State**: Zustand for global state, `useState`/`useReducer` for local
5. **Data fetching**: TanStack Query for all async operations
6. **Components**: Under 150 lines, single responsibility
7. **Naming**: PascalCase components, camelCase hooks, kebab-case files
8. **Spec-first**: No code before approved spec

See `.specify/memory/constitution.md` for full details.

## Key Patterns & Architecture

### State Management with Zustand

Global state lives in `src/stores/`. Stores use `persist` middleware for localStorage when needed.

Example:
```typescript
export const useNotificationStore = create<NotificationStore>()(
  persist((set, get) => ({
    notifications: [],
    addNotification: (type, message) => { ... },
    dismissToast: (id) => { ... },
  }), {
    name: 'notification-store',
    partialize: (state) => ({ notifications: state.notifications })
  })
)
```

### Component Structure

- Container components handle state and store subscriptions
- Presentational components receive props and emit events
- Portals (`createPortal`) for overlays (toasts, modals)
- Composed from shadcn/ui primitives only

### Data Fetching

All server data MUST use TanStack Query:

```typescript
const { data, isLoading, isError } = useQuery({
  queryKey: ['pokemon', 'list'],
  queryFn: fetchPokemonList,
  staleTime: Infinity,
})
```

### TypeScript Configuration

Strict mode is enabled in `tsconfig.app.json`:
- `strict: true` (includes all strict flags)
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitAny: true`
- `alwaysStrict: true`

## Testing Strategy

Project constitution requires testing (Vitest + React Testing Library recommended). When writing tests:

- Place tests alongside components or in `__tests__` directories
- Use MSW (Mock Service Worker) for API mocking
- Test user interactions, not implementation details
- Test accessibility (keyboard navigation, ARIA)

## Git Workflow

- Default branch: `master`
- Feature branches: sequential numbered (`001-feature-name`, auto-created by SPECKIT)
- Commit messages: conventional commits preferred
- SPECKIT hooks can auto-commit at milestones (enabled by default)

## ESLint & Type Checking

```bash
# Lint all files
npm run lint

# Type checking (part of build)
npm run build
```

ESLint config includes:
- `@eslint/js` recommended rules
- `typescript-eslint` strict rules
- `eslint-plugin-react-hooks` for hook rules
- `eslint-plugin-react-refresh` for Vite fast refresh

## Current Implementation Focus

**Active Feature**: Notification System (`specs/002-notification-system/`)

Read the current plan at `specs/002-notification-system/spec.md` for detailed requirements. Key components already implemented:
- `src/stores/notification-store.ts` - Zustand store with persistence
- `src/components/toast-container.tsx` - Portal-based toast rendering
- `src/components/toast.tsx` - Individual toast with slide-in animation
- `src/components/notification-bell.tsx` - Bell with badge
- `src/components/notification-dropdown.tsx` - Dropdown panel with read/unread

### How to Test the Notification System

1. Start dev server: `npm run dev`
2. The app displays `Pokemon Explorer` with a bell icon in the header
3. Trigger error state by disconnecting and reconnecting to see error toast
4. To manually test, add in `App.tsx`:
   ```typescript
   const addNotification = useNotificationStore.getState().addNotification
   addNotification('success', 'Test notification')
   ```
5. Click bell to see dropdown, mark as read, clear all

## Important Files

- **Constitution**: `.specify/memory/constitution.md` - Governing principles
- **SPECKIT config**: `.specify/extensions.yml` - Hook configuration
- **Current spec**: `specs/002-notification-system/spec.md`
- **Implementation plan**: `specs/002-notification-system/plan.md`
- **Tasks**: `specs/002-notification-system/tasks.md` (generated)

## Notes for Claude Code

- ALWAYS check the active spec (`specs/002-notification-system/`) before making changes
- Verify constitution compliance; if uncertain, consult `.specify/memory/constitution.md`
- Follow the 150-line component limit; extract hooks or split if approaching limit
- All new global state MUST use Zustand, all server data MUST use TanStack Query
- Prefer existing patterns (see `src/`) when implementing new features
- Shadcn/ui components are imported from `@/components/ui/*` if needed
- The project uses path aliases: `@/*` → `src/*`
- For imports from shadcn/ui, ensure components are installed first

## Troubleshooting

### TypeScript errors
Check `tsconfig.app.json` for strict settings. Ensure all types are explicit.

### State not persisting
Verify Zustand store uses `persist` middleware and `partialize` excludes non-serializable values (like timers).

### Port already in use
Vite default port is 5173. Change in `vite.config.ts` if needed.

### SPECKIT commands not working
Ensure `.specify/` directory exists with valid `extensions.yml`. SPECKIT must be installed in the environment.

## Environment

- Node.js: LTS (20+ recommended)
- Package manager: npm (package-lock.json present)
- OS: Linux/macOS/Windows
