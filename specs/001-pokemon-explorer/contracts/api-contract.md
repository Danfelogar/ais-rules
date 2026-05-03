# API Contract: PokeAPI Integration

**Date**: 2026-05-03
**Feature**: Pokemon Explorer

## External API: PokeAPI (v2)

Base URL: `https://pokeapi.co/api/v2/`
Authentication: None

### GET /pokemon?limit={n}

**Purpose**: Retrieve list of all Pokemon with name and URL.

**Parameters**:
- `limit`: integer — maximum number of results (use 1302 for all)

**Response**: JSON

```json
{
  "count": 1302,
  "next": null,
  "previous": null,
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    }
  ]
}
```

**Error Codes**:
- 429: Rate limited — back off and retry
- 5xx: Server error — display fallback message

---

### GET /pokemon/{name}

**Purpose**: Retrieve detailed information for a specific Pokemon.

**Parameters**:
- `name`: string — lowercase Pokemon name (e.g., "pikachu")

**Response**: JSON

```json
{
  "id": 25,
  "name": "pikachu",
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  },
  "types": [
    {
      "slot": 1,
      "type": { "name": "electric", "url": "..." }
    }
  ],
  "stats": [
    {
      "base_stat": 35,
      "stat": { "name": "hp", "url": "..." }
    }
  ],
  "moves": [
    {
      "move": { "name": "thunder-shock", "url": "..." }
    }
  ],
  "abilities": [
    {
      "ability": { "name": "static", "url": "..." }
    }
  ]
}
```

**Error Codes**:
- 404: Pokemon not found — show "not found" state
- 429: Rate limited — back off
- 5xx: Server error — display fallback

---

## Internal Contracts

### usePokemonSearch Hook

```typescript
interface UsePokemonSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: PokemonSummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
}
```

### usePokemonDetail Hook

```typescript
interface UsePokemonDetailReturn {
  pokemon: Pokemon | undefined;
  isLoading: boolean;
  isError: boolean;
}
```

### Favorites Store

```typescript
interface FavoritesStore {
  names: string[];
  isFavorite: (name: string) => boolean;
  toggleFavorite: (name: string) => void;
}
```
