# Implementation Plan: Pokemon Explorer

**Branch**: `001-pokemon-explorer` | **Date**: 2026-05-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-pokemon-explorer/spec.md`

## Summary

Build a client-side Pokemon Explorer application where users search for Pokemon by name,
browse results with debounced search, view detailed information in a side panel (desktop) or
bottom sheet (mobile), and manage favorite Pokemon persisted to localStorage. The app
consumes the public PokeAPI (v2, no authentication required) and delivers a responsive,
shadcn/ui-styled interface with TypeScript strict mode.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: Vite, React 18, shadcn/ui, TanStack Query v5, Zustand, Tailwind CSS  
**Storage**: Browser localStorage (via Zustand persist middleware)  
**Testing**: Vitest + React Testing Library + MSW (for PokeAPI mocking)  
**Target Platform**: Web (desktop and mobile browsers)  
**Project Type**: Single-page web application (client-side only)  
**Performance Goals**: <1 second search results update after debounce; initial render <500ms  
**Constraints**: No backend; PokeAPI rate limits apply; offline graceful degradation  
**Scale/Scope**: Single-user client-side app; targets ~1300 Pokemon records

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] TypeScript strict mode is not relaxed (Principle I)
- [x] React 18 functional components only, no class components (Principle II)
- [x] shadcn/ui + Tailwind CSS for all UI work (Principle III)
- [x] Zustand for global state, local state for component-only (Principle IV)
- [x] TanStack Query for all async data fetching (Principle V)
- [x] Components remain under 150 lines with single responsibility (Principle VI)
- [x] Naming conventions: PascalCase components, camelCase hooks/utils, kebab-case files (Principle VII)
- [x] Feature spec exists and is approved before implementation (Principle VIII)

**Constitution Check Result**: PASSED — all principles satisfied. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-pokemon-explorer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── search-bar.tsx
│   ├── pokemon-grid.tsx
│   ├── pokemon-card.tsx
│   ├── pokemon-detail.tsx
│   └── favorites-tab.tsx
├── hooks/
│   ├── use-pokemon-search.ts
│   └── use-pokemon-detail.ts
├── stores/
│   └── favorites-store.ts
├── types/
│   └── pokemon.ts
├── lib/
│   ├── api-client.ts
│   └── utils.ts
├── app.tsx
└── main.tsx

public/
└── [vite static assets]

index.html
vite.config.ts
tsconfig.json
tailwind.config.js
package.json
```

**Structure Decision**: Single-project Vite SPA. Frontend-only with no backend.
Components are colocated under `src/components/`, custom hooks under `src/hooks/`,
Zustand stores under `src/stores/`, and API client logic under `src/lib/`.

## Research Findings

### PokeAPI Search Strategy

The PokeAPI does not provide a fuzzy search endpoint. `/pokemon/{name}` returns a single
Pokemon by exact name. To implement search, we have two options:

1. **Fetch all on mount**: Load `/pokemon?limit=1302` (list of names/URLs), cache locally,
   and filter client-side. Fast search after initial load.
2. **Fetch-by-name**: Hit `/pokemon/{name}` with the debounced query. Simple but fails for
   partial matches.

**Decision**: Use Option 1 — fetch the full list on mount and search client-side.
Rationale: Pokemon names are exact (users search "pikachu", not "pika"), and the list
payload is small (~40KB). This avoids rate limits and provides instant debounced filtering.

### shadcn/ui Components to Install

- `input` — search bar
- `card` — pokemon result cards
- `badge` — type indicators
- `tabs` — All/Favorites view switch
- `sheet` — mobile detail bottom overlay
- `scroll-area` — scrollable move/ability lists

### Zustand Persist Configuration

Favorites store uses `zustand/middleware` `persist` with `localStorage`. Storage key:
`pokemon-favorites`. Schema is a Set-like store of Pokemon names (string IDs) rather
than full objects to minimize storage size.

### TanStack Query Cache Strategy

- Query key for list: `['pokemon', 'list']` — staleTime: `Infinity` (list rarely changes)
- Query key for detail: `['pokemon', 'detail', name]` — staleTime: `5 minutes`
- All queries default to stale-while-revalidate

## Complexity Tracking

No constitutional violations detected. All decisions align with principles.
