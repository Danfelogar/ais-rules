import { PokemonCard } from './pokemon-card'
import type { PokemonSummary } from '@/types/pokemon'

export function PokemonGrid({
  summaries,
  selectedName,
  onSelect,
}: {
  summaries: PokemonSummary[]
  selectedName: string | null
  onSelect: (name: string) => void
}) {
  if (summaries.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No Pokemon found. Try a different search.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {summaries.map((summary) => (
        <PokemonCard
          key={summary.name}
          summary={summary}
          isSelected={summary.name === selectedName}
          onClick={() => onSelect(summary.name)}
        />
      ))}
    </div>
  )
}
