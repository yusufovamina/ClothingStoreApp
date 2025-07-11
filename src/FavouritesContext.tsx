import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavouritesContextType = {
  favourites: string[];
  isFavourite: (id: string) => boolean;
  addFavourite: (id: string) => void;
  removeFavourite: (id: string) => void;
  toggleFavourite: (id: string) => void;
  clearFavourites: () => void;
};

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserIdAndFavourites = async () => {
      const userStr = await AsyncStorage.getItem('user');
      let uid = null;
      if (userStr) {
        const user = JSON.parse(userStr);
        uid = user.id ? String(user.id) : null;
        setUserId(uid);
      }
      if (uid) {
        const favStr = await AsyncStorage.getItem(`favourites_${uid}`);
        setFavourites(favStr ? JSON.parse(favStr) : []);
      } else {
        setFavourites([]);
      }
    };
    loadUserIdAndFavourites();
  }, []);

  useEffect(() => {
    if (userId) {
      AsyncStorage.setItem(`favourites_${userId}` , JSON.stringify(favourites));
    }
  }, [favourites, userId]);

  const isFavourite = (id: string) => favourites.includes(id);
  const addFavourite = (id: string) => setFavourites(prev => prev.includes(id) ? prev : [...prev, id]);
  const removeFavourite = (id: string) => setFavourites(prev => prev.filter(favId => favId !== id));
  const toggleFavourite = (id: string) => isFavourite(id) ? removeFavourite(id) : addFavourite(id);

  const clearFavourites = () => setFavourites([]);

  return (
    <FavouritesContext.Provider value={{ favourites, isFavourite, addFavourite, removeFavourite, toggleFavourite, clearFavourites }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within a FavouritesProvider');
  return ctx;
}; 