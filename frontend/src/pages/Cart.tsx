import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const Cart: React.FC = () => {
  const { cart, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full text-gray-300 mb-8">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our collection and find something you love.
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Items List */}
        <div className="lg:col-span-8">
          <div className="bg-white">
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <Link 
            to="/shop" 
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black transition-colors mt-8"
          >
            <ArrowLeft size={16} className="mr-2" /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-3xl p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{totalPrice > 150 ? 'Free' : '$15.00'}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Estimated Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice > 150 ? 0 : 15) + (totalPrice * 0.08)).toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full py-7 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3">
              <CreditCard size={20} />
              <span>Checkout Now</span>
            </Button>

            <div className="mt-8 space-y-4">
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                Secure Checkout Powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
