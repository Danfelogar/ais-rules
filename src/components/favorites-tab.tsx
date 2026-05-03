import { PokemonGrid } from './pokemon-grid'
import { useFavoritesStore } from '@/stores/favorites-store'
import type { PokemonSummary } from '@/types/pokemon'

export function FavoritesTab({
  selectedName,
  onSelect,
  allSummaries,
}: {
  selectedName: string | null
  onSelect: (name: string) => void
  allSummaries: PokemonSummary[]
}) {
  const favoriteNames = useFavoritesStore((s) => s.names)

  const favorited = allSummaries.filter((s) => favoriteNames.includes(s.name))

  if (favorited.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-400">
        <p>No favorites yet.</p>
        <p className="text-sm">Star some Pokemon to see them here!</p>
      </div>
    )
  }

  return (
    <PokemonGrid summaries={favorited} selectedName={selectedName} onSelect={onSelect} />
  )
}
