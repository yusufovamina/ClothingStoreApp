import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FavouritesContextType = {
  favourites: string[];
  isFavourite: (id: string) => boolean;
  addFavourite: (id: string) => void;
  removeFavourite: (id: string) => void;
  toggleFavourite: (id: string) => void;
};

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<string[]>([]);

  const isFavourite = (id: string) => favourites.includes(id);
  const addFavourite = (id: string) => setFavourites(prev => prev.includes(id) ? prev : [...prev, id]);
  const removeFavourite = (id: string) => setFavourites(prev => prev.filter(favId => favId !== id));
  const toggleFavourite = (id: string) => isFavourite(id) ? removeFavourite(id) : addFavourite(id);

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, addFavourite, removeFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within a FavouritesProvider');
  return ctx;
}; 