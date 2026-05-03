import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  names: string[];
  toggleFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      names: [],
      toggleFavorite: (name: string) => {
        const current = get().names;
        const exists = current.includes(name);
        if (exists) {
          set({ names: current.filter((n) => n !== name) });
        } else {
          set({ names: [...current, name] });
        }
      },
      isFavorite: (name: string) => get().names.includes(name),
    }),
    {
      name: 'pokemon-favorites',
      version: 0,
    }
  )
);
