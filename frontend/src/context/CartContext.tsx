import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { products } from '../data/products';

interface CartItem {
  productId: string; // store product.id as string
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
  const token = localStorage.getItem('token');

  const refreshCart = async () => {
    if (!token) return;

    const res = await axios.get('http://localhost:5000/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });

    setCart(res.data.items || []);
  };

  useEffect(() => {
    refreshCart();
  }, [token]);

  const addToCart = async (productId: string) => {
    const res = await axios.post(
      'http://localhost:5000/api/cart/add',
      { productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCart(res.data.items);
  };

  const removeFromCart = async (productId: string) => {
    const res = await axios.delete(
      `http://localhost:5000/api/cart/remove/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCart(res.data.items);
  };

  const updateQuantity = async (productId: string, delta: number) => {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    const res = await axios.post(
      'http://localhost:5000/api/cart/add',
      { productId, quantity: delta },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCart(res.data.items);
  };

  const clearCart = async () => {
    await axios.delete('http://localhost:5000/api/cart/clear', {
      headers: { Authorization: `Bearer ${token}` }
    });

    setCart([]);
  };


  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(p => String(p.id) === String(item.productId));
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};