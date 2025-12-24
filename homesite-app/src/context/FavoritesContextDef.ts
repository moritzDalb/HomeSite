import { createContext } from 'react';

export interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (url: string) => void;
  isFavorite: (url: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
