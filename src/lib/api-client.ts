import type { PokeApiListResponse, PokeApiPokemonResponse, Pokemon } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const typeColorMap: Record<string, string> = {
  normal: 'bg-normal',
  fire: 'bg-fire',
  water: 'bg-water',
  electric: 'bg-electric',
  grass: 'bg-grass',
  ice: 'bg-ice',
  fighting: 'bg-fighting',
  poison: 'bg-poison',
  ground: 'bg-ground',
  flying: 'bg-flying',
  psychic: 'bg-psychic',
  bug: 'bg-bug',
  rock: 'bg-rock',
  ghost: 'bg-ghost',
  dragon: 'bg-dragon',
  dark: 'bg-dark',
  steel: 'bg-steel',
  fairy: 'bg-fairy',
  unknown: 'bg-unknown',
  shadow: 'bg-shadow',
};

export async function fetchPokemonList(): Promise<PokeApiListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=1302`);
  if (!res.ok) throw new Error('Failed to fetch Pokemon list');
  return res.json() as Promise<PokeApiListResponse>;
}

export async function fetchPokemonDetail(name: string): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokemon: ${name}`);
  const data = await res.json() as PokeApiPokemonResponse;

  const imageUrl = data.sprites.front_default
    ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

  return {
    id: data.id,
    name: data.name,
    imageUrl,
    types: data.types.map((t) => ({
      name: t.type.name,
      color: typeColorMap[t.type.name] ?? 'bg-unknown',
    })),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    moves: data.moves.map((m) => ({ name: m.move.name })),
    abilities: data.abilities.map((a) => ({ name: a.ability.name })),
  };
}
