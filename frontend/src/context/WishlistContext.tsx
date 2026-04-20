import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Product, products } from '../data/products';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const resolveProductId = (productId: any) => {
  if (productId && typeof productId === 'object') {
    return productId._id ?? productId.id ?? productId.productId ?? productId;
  }
  return productId;
};

const getWishlistStorageKey = (email?: string | null) => (email ? `wishlist_${email}` : null);

const readLocalWishlist = (email?: string | null): Product[] => {
  if (typeof window === 'undefined') return [];
  const storageKey = getWishlistStorageKey(email);
  if (!storageKey) return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const persistLocalWishlist = (email: string | null | undefined, list: Product[]) => {
  if (typeof window === 'undefined') return;
  const storageKey = getWishlistStorageKey(email);
  if (!storageKey) return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(list));
  } catch {}
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => readLocalWishlist(user?.email));

  const getToken = () => localStorage.getItem('token');

  const refreshWishlist = async () => {
    const token = getToken();
    
    if (!token) {
      const localList = readLocalWishlist(user?.email);
      setWishlist(localList);
      return;
    }

    try {
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const backendProducts = res.data || [];
      const nextList = backendProducts.map((p: any) => {
        const id = Number(resolveProductId(p));
        const found = products.find(prod => Number(prod.id) === id);
        return found || p;
      }).filter((item: any) => item && item.id);
      
      setWishlist(nextList);
      persistLocalWishlist(user?.email, nextList);
    } catch (err) {
      console.error('Wishlist load error:', err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user?.email]);

  const addToWishlist = async (product: Product) => {
    const token = getToken();

    if (!token) {
       setWishlist((prev) => {
        if (prev.find((item) => item.id === product.id)) return prev;
        const nextList = [...prev, product];
        persistLocalWishlist(user?.email, nextList);
        return nextList;
      });
      return;
    }

    try {
       // Optimistic UI updates
       setWishlist((prev) => {
        if (prev.find((item) => item.id === product.id)) return prev;
        const nextList = [...prev, product];
        persistLocalWishlist(user?.email, nextList);
        return nextList;
      });

      await axios.post(
        '/api/wishlist/add',
        { productId: product.id }, // Assume passing the int or string ID the backend accepts
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Add to wishlist error:', err);
      // Optional: rollback on fail
      refreshWishlist();
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const token = getToken();

    if (!token) {
      setWishlist((prev) => {
        const nextList = prev.filter((item) => item.id !== productId);
        persistLocalWishlist(user?.email, nextList);
        return nextList;
      });
      return;
    }

    try {
      setWishlist((prev) => {
        const nextList = prev.filter((item) => item.id !== productId);
        persistLocalWishlist(user?.email, nextList);
        return nextList;
      });

      await axios.delete(
        `/api/wishlist/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      refreshWishlist();
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => Number(item.id) === Number(productId));
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
