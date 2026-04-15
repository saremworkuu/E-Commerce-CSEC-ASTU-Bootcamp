import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, X } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';   // <-- Added for login check
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_PRODUCT_IMAGE = 'https://i.pinimg.com/736x/b7/ad/4d/b7ad4d92a5d88e43f132a14a9fba483e.jpg';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();                    // <-- Added
  const navigate = useNavigate();                      // <-- Added

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);           // <-- Hides cart button after add
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (added) return; // prevent multiple clicks

    setIsAdding(true);
    addToCart(product);
    setAdded(true);                    // hide cart icon after successful add

    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
      >
        {/* Image Container */}
        <div className="aspect-[4/5] overflow-hidden relative">
          <motion.img 
            src={product.image?.trim() || FALLBACK_PRODUCT_IMAGE}
            alt={product.name}
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = FALLBACK_PRODUCT_IMAGE;
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          
          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center space-x-4 backdrop-blur-[2px]">
            <Link 
              to={`/product/${product.id}`}
              className="p-4 bg-white rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl"
            >
              <Eye size={22} />
            </Link>

            {!added && (   // <-- Hide cart button after added
              <motion.button 
                onClick={handleAddToCart}
                whileTap={{ scale: 0.9 }}
                className={`p-4 rounded-full transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-xl ${
                  isAdding ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <ShoppingCart size={22} className="text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <ShoppingCart size={22} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>

          {product.featured && (
            <span className="absolute top-6 left-6 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/10">
              Limited Edition
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {product.category}
            </span>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors tracking-tight">
              {product.name}
            </h3>
          </Link>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-light text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            <motion.div 
              initial={{ width: 0 }}
              whileHover={{ width: "2rem" }}
              className="h-[1px] bg-black transition-all"
            />
          </div>
        </div>

        {/* Adding to Cart Feedback Overlay */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Adding to bag</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Login Required Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 m-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center"
            >
              <X 
                className="mx-auto mb-6 text-gray-400 cursor-pointer" 
                size={32} 
                onClick={() => setShowLoginModal(false)} 
              />
              <h2 className="text-2xl font-bold mb-3">Sign in to add to cart</h2>
              <p className="text-gray-600 mb-8">
                You need to be logged in to save items in your cart.
              </p>
              
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Go to Sign In
              </button>

              <p className="mt-6 text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-black font-medium hover:underline" onClick={() => setShowLoginModal(false)}>
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;