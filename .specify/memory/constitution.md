<!--
SYNC IMPACT REPORT
Version Change: template → 1.0.0
Modified Principles: All 8 principles established for the first time
Added Sections: Core Principles (8), Technology Stack, Development Workflow, Governance
Removed Sections: None
Templates Updated:
  - .specify/templates/plan-template.md (Constitution Check gates updated)
  - .specify/templates/spec-template.md (Added constitution compliance reference)
  - .specify/templates/tasks-template.md (Sample tasks aligned with tech stack)
Follow-up TODOs:
  - TODO(BUILD_TOOL): Specify build tool in Technology Stack table
-->

# ais-rules Constitution

## Core Principles

### I. TypeScript Language Standards

TypeScript MUST be used in strict mode everywhere with `noImplicitAny` enabled.
All code MUST have explicit type annotations on public APIs; inferred types are
acceptable for internal variables when unambiguous. No `any` types are permitted
except in rare interoperability cases, which MUST be documented with a
suppressing comment and a code-review-approved justification.

**Rationale**: Strict typing eliminates entire categories of runtime bugs and
enables confident refactoring. Implicit `any` degrades the value of the type
system and undermines long-term maintainability.

### II. React Framework Standards

React 18 is the sole UI framework. All components MUST be functional
components using hooks; class components are prohibited. Hooks MUST follow the
Rules of React (only called at top level, only called from React functions).
Custom hooks MUST be extracted when the same logic is used in more than one
component.

**Rationale**: Functional components with hooks are the modern React standard,
offer better tree-shaking, simpler testing, and align with the React team's
long-term direction.

### III. UI & Styling Standards

shadcn/ui is the primary component library. All custom UI components MUST be
built on top of shadcn/ui primitives when available. Tailwind CSS is the
utility framework for all styling needs. No other CSS-in-JS libraries or CSS
modules are permitted without explicit constitutional amendment.

**Rationale**: A single, well-integrated component and styling system ensures
visual consistency, reduces bundle fragmentation, and leverages the extensive
Tailwind ecosystem.

### IV. State Management Discipline

Zustand is the mandatory store for global or shared state. React `useState` and
`useReducer` MUST be used for component-local state only. No other global state
libraries (Redux, MobX, Context API for high-frequency updates) are permitted.
State slices MUST be small, focused, and composed rather than monolithic.

**Rationale**: Zustand provides minimal boilerplate, excellent TypeScript
support, and avoids the performance pitfalls of Context API for rapidly changing
state.

### V. Data Fetching & Async Patterns

TanStack Query (React Query) is the exclusive tool for all asynchronous data
fetching, caching, and synchronization. Raw `useEffect` hooks MUST NOT be used
for data fetching. Mutations MUST use TanStack Query's mutation APIs. Server
state MUST be clearly separated from client state.

**Rationale**: TanStack Query handles caching, background updates, error states,
and deduplication out of the box, eliminating an entire class of bugs that arise
from manual fetch logic.

### VI. Component Quality & Architecture

Components MUST be small, focused, and under 150 lines of code. Each component
MUST have a single responsibility. Complex features MUST be decomposed into
multiple composable components rather than monolithic ones. Shared logic MUST be
extracted into custom hooks or utility functions.

**Rationale**: Small, single-responsibility components are easier to test,
review, reason about, and reuse. The 150-line limit is a forcing function for
proper decomposition.

### VII. Naming & File Conventions

React components MUST use PascalCase (e.g., `UserProfile`). Custom hooks and
utility functions MUST use camelCase (e.g., `useAuth`, `formatDate`). File
names MUST use kebab-case (e.g., `user-profile.tsx`, `use-auth.ts`). Consistency
in naming across the entire codebase is mandatory.

**Rationale**: Uniform naming conventions reduce cognitive load, enable
reliable glob patterns in tooling, and make imports predictable across the
project.

### VIII. Specification-First Development

All new features MUST have a clear, written specification before implementation
begins. The specification MUST include user stories, acceptance criteria, and
measurable success criteria. No code for a new feature may be written before
its spec is reviewed and approved.

**Rationale**: Writing the spec first forces clarification of requirements,
prevents scope creep, and provides an objective basis for acceptance testing
and future maintenance.

## Technology Stack

The following technologies constitute the approved stack. Deviations require
constitutional amendment.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Language | TypeScript (strict mode) | Type-safe development |
| Framework | React 18 | UI rendering |
| Components | shadcn/ui | Reusable UI primitives |
| Styling | Tailwind CSS | Utility-first CSS |
| Global State | Zustand | Shared application state |
| Data Fetching | TanStack Query | Server state management |
| Build Tool | TODO(BUILD_TOOL): specify build tool | Bundling and dev server |

## Development Workflow

### Code Review Requirements

All pull requests MUST be reviewed for constitutional compliance. Reviewers MUST
verify that:
- TypeScript strict mode is not relaxed
- No class components are introduced
- Component line counts remain under 150 lines
- Naming conventions are followed
- TanStack Query is used for all new data fetching
- Zustand is used for all new global state

### Specification Gate

No feature branch may be created without an approved spec. The `/speckit-specify`
command MUST be run and the resulting `spec.md` approved before `/speckit-plan`
or implementation begins.

### Quality Gates

- All code MUST pass TypeScript compilation with strict settings
- All unit tests MUST pass before merge
- No console errors or warnings in production builds

## Governance

This constitution supersedes all other coding standards and style guides for the
project. Amendments require:
1. A written proposal documenting the change and its rationale
2. Approval by the project maintainer
3. An update to `LAST_AMENDED_DATE` and appropriate version bump
4. A migration plan for existing code if the amendment is breaking

Versioning follows semantic versioning:
- **MAJOR**: Backward-incompatible governance changes or principle removals
- **MINOR**: New principles or materially expanded guidance
- **PATCH**: Clarifications, wording improvements, non-semantic refinements

All PRs and code reviews MUST verify compliance with this constitution.
Complexity that violates principles MUST be justified in the PR description
with reference to the specific principle and why an exception is necessary.

**Version**: 1.0.0 | **Ratified**: 2026-05-03 | **Last Amended**: 2026-05-03
