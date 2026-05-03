export interface PokemonType {
  name: string;
  color: string;
}

export interface Stat {
  name: string;
  value: number;
}

export interface Move {
  name: string;
}

export interface Ability {
  name: string;
}

export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: PokemonType[];
  stats: Stat[];
  moves: Move[];
  abilities: Ability[];
}

export interface PokemonSummary {
  name: string;
  url: string;
}

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonSummary[];
}

export interface PokeApiPokemonResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
  }>;
}
