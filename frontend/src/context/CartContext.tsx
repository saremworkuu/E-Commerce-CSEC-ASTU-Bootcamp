import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { products } from '../data/products';
import { useAuth } from './AuthContext';

interface CartItem {
  productId: any; // backend may return populated object OR primitive id
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const resolveProductId = (productId: any) => {
  if (productId && typeof productId === 'object') {
    return productId._id ?? productId.id ?? productId.productId ?? productId;
  }

  return productId;
};

const normalizeCart = (items: CartItem[] = []) =>
  items.map((item) => ({
    productId: resolveProductId(item.productId),
    quantity: item.quantity,
  }));

const buildCheckoutCart = (items: CartItem[] = []) =>
  items.map((item) => {
    const normalizedProductId = Number(resolveProductId(item.productId));
    const product = products.find((entry) => Number(entry.id) === normalizedProductId);

    return {
      productId: normalizedProductId,
      quantity: item.quantity,
      name: product?.name ?? item.productId?.name ?? 'Product',
      price: product?.price ?? item.productId?.price ?? 0,
      imageUrl: product?.image ?? item.productId?.imageUrl ?? '',
    };
  });

const getCartStorageKey = (email?: string | null) => (email ? `cart_${email}` : null);

const readLocalCart = (email?: string | null): CartItem[] => {
  if (typeof window === 'undefined') return [];

  const storageKey = getCartStorageKey(email);
  if (!storageKey) return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return normalizeCart(
      parsed.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity) || 1,
      }))
    );
  } catch {
    return [];
  }
};

const persistLocalCart = (email: string | null | undefined, items: CartItem[]) => {
  if (typeof window === 'undefined') return;

  const storageKey = getCartStorageKey(email);
  if (!storageKey) return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(buildCheckoutCart(items)));
  } catch {
    // Ignore storage failures in non-browser environments
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => readLocalCart(user?.email));

  // 🔥 always get fresh token (IMPORTANT FIX)
  const getToken = () => localStorage.getItem('token');

  // ================= LOAD CART =================
  const refreshCart = async () => {
    const token = getToken();

    if (!token) {
      const localCart = readLocalCart(user?.email);
      setCart(localCart);
      return;
    }

    try {
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const nextCart = normalizeCart(res.data.items || []);
      setCart(nextCart);
      persistLocalCart(user?.email, nextCart);
    } catch (err) {
      console.error('Cart load error:', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user?.email]);

  // ================= ADD TO CART =================
  const addToCart = async (productId: string) => {
    const token = getToken();

    if (!token) {
      const normalizedProductId = Number(productId);

      setCart((prev) => {
        const existing = prev.find(
          (item) => Number(resolveProductId(item.productId)) === normalizedProductId
        );

        let nextCart: CartItem[];

        if (existing) {
          nextCart = prev.map((item) =>
            Number(resolveProductId(item.productId)) === normalizedProductId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          nextCart = [...prev, { productId: normalizedProductId, quantity: 1 }];
        }

        persistLocalCart(user?.email, nextCart);
        return nextCart;
      });

      return;
    }

    try {
      const res = await axios.post(
        '/api/cart/add',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nextCart = normalizeCart(res.data.items || []);
      setCart(nextCart);
      persistLocalCart(user?.email, nextCart);
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  // ================= REMOVE =================
  const removeFromCart = async (productId: string) => {
    const token = getToken();

    if (!token) {
      const nextCart = cart.filter(
        (item) => Number(resolveProductId(item.productId)) !== Number(productId)
      );
      setCart(nextCart);
      persistLocalCart(user?.email, nextCart);
      return;
    }

    try {
      const res = await axios.delete(
        `/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nextCart = normalizeCart(res.data.items || []);
      setCart(nextCart);
      persistLocalCart(user?.email, nextCart);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE QUANTITY =================
  const updateQuantity = async (productId: string, delta: number) => {
    const token = getToken();
    if (!token) {
      const nextCart = cart
        .map((item) => {
          if (Number(resolveProductId(item.productId)) !== Number(productId)) {
            return item;
          }

          return { ...item, quantity: item.quantity + delta };
        })
        .filter((item) => item.quantity > 0);

      setCart(nextCart);
      persistLocalCart(user?.email, nextCart);
      return;
    }

    const item = cart.find(i =>
      Number(resolveProductId(i.productId)) === Number(productId)
    );

    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    try {
      const res = await axios.post(
        '/api/cart/add',
        { productId, quantity: delta },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nextCart = normalizeCart(res.data.items || []);
      setCart(nextCart);
      persistLocalCart(user?.email, nextCart);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CLEAR CART =================
  const clearCart = async () => {
    const token = getToken();

    if (!token) {
      setCart([]);
      persistLocalCart(user?.email, []);
      return;
    }

    try {
      await axios.delete('/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart([]);
      persistLocalCart(user?.email, []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= TOTALS =================
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.productId?.price || products.find((entry) => Number(entry.id) === Number(resolveProductId(item.productId)))?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};