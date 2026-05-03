import { Star } from 'lucide-react'
import { usePokemonDetail } from '@/hooks/use-pokemon-detail'
import { useFavoritesStore } from '@/stores/favorites-store'
import type { PokemonSummary } from '@/types/pokemon'

export function PokemonCard({
  summary,
  isSelected,
  onClick,
}: {
  summary: PokemonSummary
  isSelected: boolean
  onClick: () => void
}) {
  const { pokemon, isLoading } = usePokemonDetail(summary.name)
  const isFavorite = useFavoritesStore((s) => s.isFavorite)
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  const hp = pokemon?.stats.find((s) => s.name === 'hp')
  const attack = pokemon?.stats.find((s) => s.name === 'attack')
  const defense = pokemon?.stats.find((s) => s.name === 'defense')

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite(summary.name)
        }}
        className="absolute right-2 top-2 z-10 rounded-full p-1 hover:bg-gray-100"
      >
        <Star
          className={`h-5 w-5 transition-colors ${
            isFavorite(summary.name) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      </button>

      <div className="flex flex-col items-center gap-2">
        {pokemon?.imageUrl ? (
          <img src={pokemon.imageUrl} alt={summary.name} className="h-24 w-24 object-contain" />
        ) : (
          <div className="h-24 w-24 animate-pulse rounded-full bg-gray-100" />
        )}

        <h3 className="text-lg font-semibold capitalize">{summary.name}</h3>

        {isLoading ? (
          <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
        ) : (
          <div className="flex flex-wrap gap-1">
            {pokemon?.types.map((t) => (
              <span
                key={t.name}
                className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${t.color}`}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="mt-1 h-12 w-full animate-pulse rounded bg-gray-100" />
        ) : (
          <div className="mt-1 grid w-full grid-cols-3 gap-2 text-center text-xs text-gray-600">
            <div>
              <div className="font-bold text-gray-900">{hp?.value ?? '-'}</div>
              <div className="text-gray-400">HP</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">{attack?.value ?? '-'}</div>
              <div className="text-gray-400">Attack</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">{defense?.value ?? '-'}</div>
              <div className="text-gray-400">Defense</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}