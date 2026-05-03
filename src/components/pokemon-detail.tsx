import { X } from 'lucide-react'
import { usePokemonDetail } from '@/hooks/use-pokemon-detail'

export function PokemonDetail({
  name,
  open,
  onClose,
}: {
  name: string | null
  open: boolean
  onClose: () => void
}) {
  const { pokemon, isLoading, isError } = usePokemonDetail(name)

  if (!open || !name) return null

  return (
    <>
      {/* Mobile bottom sheet */}
      <div className="fixed inset-0 z-50 flex items-end md:hidden" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="relative w-full rounded-t-2xl bg-white p-6 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          <DetailContent pokemon={pokemon} isLoading={isLoading} isError={isError} />
        </div>
      </div>

      {/* Desktop side panel */}
      <div className={`hidden md:block ${open ? '' : 'md:hidden'}`}>
        <div className="fixed inset-y-0 right-0 z-50 w-96 overflow-y-auto bg-white p-6 shadow-xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          <DetailContent pokemon={pokemon} isLoading={isLoading} isError={isError} />
        </div>
      </div>
    </>
  )
}

function DetailContent({
  pokemon,
  isLoading,
  isError,
}: {
  pokemon: ReturnType<typeof usePokemonDetail>['pokemon']
  isLoading: boolean
  isError: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  if (isError || !pokemon) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        Failed to load Pokemon details.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <img src={pokemon.imageUrl} alt={pokemon.name} className="h-32 w-32 object-contain" />
        <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((t) => (
            <span key={t.name} className={`text-sm font-medium text-white px-3 py-1 rounded-full ${t.color}`}>
              {t.name}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Stats</h3>
        <div className="mt-2 space-y-2">
          {pokemon.stats.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-24 text-sm capitalize text-gray-600">{s.name}</span>
              <div className="flex-1 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${Math.min((s.value / 150) * 100, 100)}%` }}
                />
              </div>
              <span className="w-8 text-right text-sm font-medium text-gray-900">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Abilities</h3>
        <ul className="mt-2 space-y-1">
          {pokemon.abilities.map((a) => (
            <li key={a.name} className="text-sm capitalize text-gray-700">
              {a.name.replace(/-/g, ' ')}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Moves</h3>
        <div className="mt-2 max-h-48 overflow-y-auto">
          {pokemon.moves.length > 50 ? (
            <div>
              <p className="mb-1 text-xs text-gray-400">{pokemon.moves.length} total moves. Showing first 50:</p>
              <ul className="grid grid-cols-2 gap-1">
                {pokemon.moves.slice(0, 50).map((m) => (
                  <li key={m.name} className="text-xs capitalize text-gray-600 truncate">
                    {m.name.replace(/-/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-1">
              {pokemon.moves.map((m) => (
                <li key={m.name} className="text-xs capitalize text-gray-600 truncate">
                  {m.name.replace(/-/g, ' ')}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
