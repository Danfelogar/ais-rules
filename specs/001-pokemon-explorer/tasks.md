# Tasks: Pokemon Explorer

**Input**: Design documents from `specs/001-pokemon-explorer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/api-contract.md, research.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Vite + React 18 + TypeScript project with strict mode via `npm create vite@latest`
- [x] T002 [P] Install and configure Tailwind CSS (`npm install -D tailwindcss @tailwindcss/vite`)
- [x] T003 [P] Install UI utility libs + icons: `npm install clsx tailwind-merge lucide-react`
- [x] T004 [P] Install runtime dependencies: `npm install zustand @tanstack/react-query`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Create Pokemon type definitions in `src/types/pokemon.ts` (Pokemon, PokemonType, Stat, Move, Ability)
- [x] T006 [P] Create PokeAPI client in `src/lib/api-client.ts` (fetch list and detail methods)
- [x] T007 [P] Create TanStack Query provider wrapper and add to `src/App.tsx`
- [x] T008 Configure Zustand favorites store skeleton with `zustand/middleware` persist in `src/stores/favorites-store.ts`

**Checkpoint**: Foundation ready — types, API client, query provider, and store skeleton exist. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Search and Browse Pokemon (Priority: P1) 🎯 MVP

**Goal**: Users can type a Pokemon name into a search bar and see debounced results as cards displaying image, name, type badges, and base stats (HP, Attack, Defense).

**Independent Test**: Open the app, type "pikachu" in the search bar, and verify that cards appear showing Pikachu's image, name, "electric" type badge, and base stats.

### Implementation for User Story 1

- [x] T009 [P] [US1] Create `SearchBar` component in `src/components/search-bar.tsx` (shadcn/ui Input + debounce with `useDeferredValue` or `useEffect` debounce)
- [x] T010 [P] [US1] Create `PokemonCard` component in `src/components/pokemon-card.tsx` (shadcn/ui Card + Badge, shows image, name, types, stats)
- [x] T011 [P] [US1] Create `PokemonGrid` component in `src/components/pokemon-grid.tsx` (responsive grid layout for cards)
- [x] T012 [US1] Implement `usePokemonSearch` hook in `src/hooks/use-pokemon-search.ts` (TanStack Query list fetch + client-side filtering with debounce)
- [x] T013 [US1] Wire search + grid into `src/app.tsx` with main layout and responsive container

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can search and browse Pokemon.

---

## Phase 4: User Story 2 — View Pokemon Details (Priority: P2)

**Goal**: Users can select a Pokemon card to view detailed moves and abilities in a side panel (desktop) or bottom sheet (mobile).

**Independent Test**: Click any Pokemon card and verify a detail view opens showing all moves and abilities. On desktop it appears on the right; on mobile it slides up from the bottom.

### Implementation for User Story 2

- [x] T014 [P] [US2] Create `PokemonDetail` component in `src/components/pokemon-detail.tsx` (shadcn/ui Sheet + ScrollArea, shows moves and abilities lists)
- [x] T015 [US2] Implement `usePokemonDetail` hook in `src/hooks/use-pokemon-detail.ts` (TanStack Query detail fetch by name)
- [x] T016 [US2] Integrate detail panel into `src/app.tsx` — manage selected Pokemon state and responsive layout (desktop: 2-column; mobile: Sheet bottom)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Search/browse plus detail view are functional.

---

## Phase 5: User Story 3 — Manage Favorites (Priority: P3)

**Goal**: Users can mark Pokemon as favorites with a star toggle, favorites persist across sessions in localStorage, and a dedicated Favorites tab shows only favorited Pokemon.

**Independent Test**: Mark several Pokemon as favorites, reload the page, and verify the Favorites tab displays only those Pokemon and the star states are preserved.

### Implementation for User Story 3

- [x] T017 [P] [US3] Complete favorites store in `src/stores/favorites-store.ts` (add `toggleFavorite`, `isFavorite` methods; persist to localStorage)
- [x] T018 [P] [US3] Create `FavoritesTab` component in `src/components/favorites-tab.tsx` (filtered grid showing only favorited Pokemon)
- [x] T019 [US3] Add favorite star toggle to `PokemonCard` in `src/components/pokemon-card.tsx` (interactive icon button wired to favorites store)
- [x] T020 [US3] Wire `Tabs` navigation (All / Favorites) into `src/app.tsx` using shadcn/ui Tabs

**Checkpoint**: All user stories should now be independently functional. Favorites persist, tab switch works, and detail panel integrates with favorites.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T021 [P] Add error boundary and loading skeletons for search and detail views
- [x] T022 [P] Add empty state (no favorites) and not-found state (no search results) UI
- [x] T023 [P] Add responsive Tailwind breakpoints (`md:`, `lg:`) to ensure layout adapts from mobile to desktop
- [x] T024 [P] Add type-to-color mapping for Pokemon type badges and verify contrast
- [x] T025 Run through `quickstart.md` setup steps to validate build and dev server

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Integrates with US1 cards but is independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Integrates with US1 cards and US2 detail panel but is independently testable

### Within Each User Story

- Components before hooks wiring
- Hook logic before component integration
- Core implementation before App.tsx wiring
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- PokemonCard + SearchBar + PokemonGrid (US1) can be developed in parallel
- PokemonDetail (US2) + favorites store (US3) can be developed in parallel after hooks exist
- Polish tasks can run in parallel once all stories are complete

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create SearchBar component in src/components/search-bar.tsx"
Task: "Create PokemonCard component in src/components/pokemon-card.tsx"
Task: "Create PokemonGrid component in src/components/pokemon-grid.tsx"

# Then wire the hook and app layout:
Task: "Implement usePokemonSearch hook in src/hooks/use-pokemon-search.ts"
Task: "Wire search + grid into src/app.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test search/browse independently (type "pikachu", verify cards)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (search + grid)
   - Developer B: User Story 2 (detail panel)
   - Developer C: User Story 3 (favorites + tabs)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
