import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface CartItem {
  productId: any; // backend returns populated object OR id
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

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🔥 always get fresh token (IMPORTANT FIX)
  const getToken = () => localStorage.getItem('token');

  // ================= LOAD CART =================
  const refreshCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart(res.data.items || []);
    } catch (err) {
      console.error('Cart load error:', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  // ================= ADD TO CART =================
  const addToCart = async (productId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart(res.data.items);
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  // ================= REMOVE =================
  const removeFromCart = async (productId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE QUANTITY =================
  const updateQuantity = async (productId: string, delta: number) => {
    const token = getToken();
    if (!token) return;

    const item = cart.find(i =>
      (i.productId?._id || i.productId) === productId
    );

    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: delta },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart(res.data.items);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CLEAR CART =================
  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart([]);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= TOTALS =================
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.productId?.price || 0;
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