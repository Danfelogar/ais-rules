import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { SearchBar } from '@/components/search-bar'
import { PokemonGrid } from '@/components/pokemon-grid'
import { PokemonDetail } from '@/components/pokemon-detail'
import { FavoritesTab } from '@/components/favorites-tab'
import { usePokemonSearch } from '@/hooks/use-pokemon-search'
import { ToastContainer } from '@/components/toast-container'
import { NotificationBell } from '@/components/notification-bell'
import { useNotificationStore } from '@/stores/notification-store'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonExplorer />
      <ToastContainer />
    </QueryClientProvider>
  )
}

function PokemonExplorer() {
  const { query, setQuery, results, isLoading, isError } = usePokemonSearch()
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all')
  const addNotification = useNotificationStore.getState().addNotification

  useEffect(() => {
    if (isError) {
      addNotification('error', 'Failed to load Pokemon data. Please try again later.')
    }
  }, [isError, addNotification])

  const defaultSummaries = results.length > 0 ? results : []

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 shadow-sm md:px-6">
        <h1 className="text-xl font-bold text-gray-900">Pokemon Explorer</h1>
        <NotificationBell />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-y-auto p-4 md:p-6">
          <div className="mb-4 space-y-3">
            <SearchBar value={query} onChange={setQuery} />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'favorites'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Favorites
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              Loading Pokemon...
            </div>
          ) : isError ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              Failed to load Pokemon data. Please try again later.
            </div>
          ) : activeTab === 'all' ? (
            <PokemonGrid
              summaries={defaultSummaries}
              selectedName={selectedName}
              onSelect={setSelectedName}
            />
          ) : (
            <FavoritesTab
              selectedName={selectedName}
              onSelect={setSelectedName}
              allSummaries={defaultSummaries}
            />
          )}
        </main>
      </div>

      <PokemonDetail
        name={selectedName}
        open={!!selectedName}
        onClose={() => setSelectedName(null)}
      />
    </div>
  )
}
