# Research: Pokemon Explorer

**Date**: 2026-05-03
**Feature**: Pokemon Explorer

## Decisions

### PokeAPI Search Strategy

**Decision**: Fetch the complete Pokemon list on mount via `/pokemon?limit=1302` and search client-side.

**Rationale**:
- The list endpoint returns name + URL for all ~1300 Pokemon in a single ~40KB JSON payload
- Client-side filtering gives immediate debounced search without API round-trips
- Avoids PokeAPI rate limits for rapid keystrokes
- Exact-name matching is sufficient (users type "pikachu", not fuzzy prefixes)

**Alternatives considered**:
- Hit `/pokemon/{name}` per keystroke: rejected due to rate limit risk and poor partial match support
- Cache with IndexedDB: rejected as overkill for a 40KB read-once list

### Image Sourcing

**Decision**: Use `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png` for images.

**Rationale**: PokeAPI response includes `sprites.front_default` but direct sprite URLs are reliable and statically hosted. Extracted from the `species.url` chain or derived from the Pokemon ID.

### Responsive Detail Panel

**Decision**: Desktop uses `shadcn/ui Sheet` (slide-over from right) on a 2-column layout.
Mobile uses the same Sheet configured as bottom sheet with full-width and overlay.

**Rationale**: shadcn/ui Sheet supports both orientations. Single shared component avoids duplication.

### Favorites Storage Schema

**Decision**: Store a `Set<string>` of Pokemon names in localStorage via Zustand persist.

**Rationale**: Pokemon names are unique identifiers. Storing only names minimizes localStorage footprint (~10 bytes per favorite vs. ~200+ bytes for full objects).

## External Resources

- PokeAPI Base: `https://pokeapi.co/api/v2/`
- List endpoint: `GET https://pokeapi.co/api/v2/pokemon?limit=1302`
- Detail endpoint: `GET https://pokeapi.co/api/v2/pokemon/{name}`
- Sprites: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`
