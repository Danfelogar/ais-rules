# Quickstart: Pokemon Explorer

**Date**: 2026-05-03
**Feature**: Pokemon Explorer

## Setup

```bash
# Install dependencies
npm install

# Install shadcn/ui components
npx shadcn add input card badge tabs sheet scroll-area

# Install runtime dependencies
npm install zustand @tanstack/react-query

# Install dev dependencies
npm install -D @tanstack/react-query-devtools vitest @testing-library/react msw

# Start dev server
npm run dev
```

## Environment Variables

None required. PokeAPI is public and unauthenticated.

## Development Workflow

1. Run `npm run dev` to start Vite dev server
2. Open `http://localhost:5173`
3. TanStack Query Devtools available in development

## Testing

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

## Build

```bash
npm run build
```

Output: `dist/` directory with static assets ready for deployment.
