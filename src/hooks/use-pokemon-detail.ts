import { useQuery } from '@tanstack/react-query'
import { fetchPokemonDetail } from '@/lib/api-client'
import type { Pokemon } from '@/types/pokemon'

export function usePokemonDetail(name: string | null) {
  const { data: pokemon, isLoading, isError } = useQuery<Pokemon>({
    queryKey: ['pokemon', 'detail', name],
    queryFn: () => fetchPokemonDetail(name as string),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  })

  return { pokemon, isLoading, isError }
}