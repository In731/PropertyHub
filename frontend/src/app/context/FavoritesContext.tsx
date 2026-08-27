import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { favoritesApi } from '../lib/api';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[]; // List of favorited property IDs
  toggleFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoritesApi.list();
      setFavorites(data.map(p => p.id));
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const currentlyFavorited = favorites.includes(propertyId);
    
    // Optimistic update
    if (currentlyFavorited) {
      setFavorites(prev => prev.filter(id => id !== propertyId));
    } else {
      setFavorites(prev => [...prev, propertyId]);
    }

    try {
      if (currentlyFavorited) {
        await favoritesApi.remove(propertyId);
      } else {
        await favoritesApi.add(propertyId);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Revert on failure
      if (currentlyFavorited) {
        setFavorites(prev => [...prev, propertyId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== propertyId));
      }
    }
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
