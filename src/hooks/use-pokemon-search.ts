import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from '@/lib/api-client'
import type { PokemonSummary } from '@/types/pokemon'

export function usePokemonSearch() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data: list, isLoading, isError } = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: fetchPokemonList,
    staleTime: Infinity,
  })

  const results: PokemonSummary[] = useMemo(() => {
    if (!debouncedQuery || !list) return []
    const q = debouncedQuery.toLowerCase()
    return list.results.filter((p: PokemonSummary) => p.name.includes(q))
  }, [debouncedQuery, list])

  return { query, setQuery, results, isLoading, isError }
}