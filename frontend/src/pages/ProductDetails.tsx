import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShoppingCart, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ FIX: use correct cart
  const { addToCart, cart } = useCart();
  const { isLoggedIn } = useAuth();

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="text-black font-bold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  // ✅ FIX: prevent duplicates
  const isAlreadyInCart = cart?.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (isAlreadyInCart) {
      alert("Already in cart 🛒");
      return;
    }

    addToCart(product.id);
  };

  // ✅ FIX: Buy Now logic
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!isAlreadyInCart) {
      addToCart(product);
    }

    navigate('/cart'); // or checkout page
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-12"
      >
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl overflow-hidden bg-gray-100 aspect-square"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2 block">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-medium text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="prose prose-sm text-gray-500 mb-10 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Buttons */}
          <div className="space-y-4 mb-12">

            <Button 
              onClick={handleAddToCart}
              className="w-full py-7 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3 h-auto"
            >
              <ShoppingCart size={20} />
              <span>
                {isAlreadyInCart ? "Already in Cart" : "Add to Cart"}
              </span>
            </Button>

            <Button 
              variant="outline"
              onClick={handleBuyNow}
              className="w-full py-7 border-2 border-black text-black font-bold rounded-2xl hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-3 h-auto"
            >
              <CreditCard size={20} />
              <span>Buy Now</span>
            </Button>

          </div>

          {/* ✅ Trust Badges (UNCHANGED) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                <Truck size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                <RotateCcw size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">30-Day Returns</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                <Shield size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">2-Year Warranty</span>
            </div>
          </div>

        </motion.div>
      </div>

      {/* ✅ Related Products (UNCHANGED) */}
      <div className="mt-24 pt-24 border-t border-gray-100">
        <h2 className="text-2xl font-bold mb-12">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:underline">{p.name}</h3>
                <p className="text-gray-500">${p.price.toFixed(2)}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;