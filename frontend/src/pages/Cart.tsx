import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';
import axios from 'axios';

const Cart: React.FC = () => {
  const { cart, totalPrice, totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to complete your purchase.');
      return;
    }

    setIsProcessing(true);
    try {
      // Calculate total with tax and shipping (same logic as UI)
      const tax = totalPrice * 0.08;
      const shipping = totalPrice > 150 ? 0 : 15;
      const totalAmount = totalPrice + tax + shipping;

      // Extract names (fallback to email if full name is missing)
      const fullName = (user as any)?.fullName || user?.email || 'Customer';
      const names = fullName.split(' ');
      const first_name = names[0];
      const last_name = names.slice(1).join(' ') || 'Customer';

      const res = await axios.post(apiUrl('/payment/initialize'), {
        amount: totalAmount.toFixed(2),
        email: user?.email,
        first_name,
        last_name
      });

      if (res.data.checkout_url) {
        // Redirect to Chapa checkout page
        window.location.href = res.data.checkout_url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.response?.data?.message || 'Payment initialization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Map raw cart items to fully hydrated product items from local data
  const populatedCart = cart.map(item => {
    const backendId = typeof item.productId === 'object' ? item.productId?._id || item.productId?.id || item.productId : item.productId;
    const normalizedId = Number(backendId);
    const matchedProduct = products.find(p => Number(p.id) === normalizedId);
    
    return {
      ...item,
      name: matchedProduct?.name || item.productId?.name || 'Unknown Product',
      price: matchedProduct?.price || item.productId?.price || 0,
      image: matchedProduct?.image || item.productId?.imageUrl || '',
      id: String(normalizedId),
    };
  });

  if (populatedCart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 dark:bg-neutral-800 rounded-full text-gray-300 dark:text-gray-600 mb-8">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">
          Looks like you haven&apos;t added anything to your cart yet. Explore our collection and find something you love.
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center justify-center px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Items List */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-transparent">
            {populatedCart.map((item, index) => (
              <CartItem key={item.id || index} item={item as any} />
            ))}
          </div>
          <Link 
            to="/shop" 
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors mt-8"
          >
            <ArrowLeft size={16} className="mr-2" /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="md:col-span-2 lg:col-span-4">
          <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-3xl p-6 sm:p-8 sticky top-24 border border-gray-100 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Shipping</span>
                <span>{totalPrice > 150 ? 'Free' : '$15.00'}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Estimated Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-neutral-800 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice > 150 ? 0 : 15) + (totalPrice * 0.08)).toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center space-x-3 h-auto disabled:opacity-50"
            >
              <CreditCard size={20} />
              <span>{isProcessing ? 'Processing...' : 'Checkout Now'}</span>
            </Button>


            <div className="mt-8 space-y-4">
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                Secure Checkout Powered by Chapa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
