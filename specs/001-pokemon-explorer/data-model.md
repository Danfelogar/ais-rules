# Data Model: Pokemon Explorer

**Date**: 2026-05-03
**Feature**: Pokemon Explorer

## Entities

### Pokemon

Represents a single Pokemon returned from PokeAPI.

| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique PokeAPI identifier |
| name | string | Lowercase identifier (e.g., "pikachu") |
| imageUrl | string | URL to front-facing sprite |
| types | PokemonType[] | Type classifications with display color |
| stats | Stat[] | Base stats: HP, Attack, Defense, etc. |
| moves | Move[] | All learnable moves |
| abilities | Ability[] | All abilities |

### PokemonType

| Field | Type | Description |
|-------|------|-------------|
| name | string | Type name (e.g., "electric", "water") |
| color | string | Tailwind color class for the badge |

### Stat

| Field | Type | Description |
|-------|------|-------------|
| name | string | Stat name (e.g., "hp", "attack", "defense") |
| value | number | Base stat value |

### Move

| Field | Type | Description |
|-------|------|-------------|
| name | string | Move identifier |

### Ability

| Field | Type | Description |
|-------|------|-------------|
| name | string | Ability identifier |

## Local Storage Schema

### Favorites Store (Zustand persist)

Stored at key `pokemon-favorites` in localStorage.

```json
{
  "state": {
    "names": ["pikachu", "charizard", "bulbasaur"]
  },
  "version": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| names | string[] | Ordered list of favorited Pokemon names |
| version | number | Schema version for future migrations |

## State Transitions

1. **Search** → Filtered Pokemon list (client-side, no API call after initial load)
2. **Select** → Detail panel opens with Pokemon name
3. **ToggleFavorite** → Add/remove name from favorites store
4. **SwitchTab** → Filter grid by "all" or "favorited" state
