import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_PRODUCT_IMAGE = 'https://placehold.co/600x750?text=No+Image';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (added) return;

    setIsAdding(true);

    // ✅ FIXED HERE
    addToCart(product.id.toString());

    setAdded(true);
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.6 }}
        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="aspect-[4/5] overflow-hidden relative">
          <motion.img
            src={product.image?.trim() || FALLBACK_PRODUCT_IMAGE}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center space-x-4 transition ${
              showActions || added ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Link to={`/product/${product.id}`} className="p-4 bg-white rounded-full">
              <Eye size={22} />
            </Link>

            {!added && (
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-white rounded-full"
              >
                <ShoppingCart size={22} />
              </motion.button>
            )}
          </div>

          {product.featured && (
            <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded">
              Limited Edition
            </span>
          )}
        </div>

        <div className="p-6">
          <span className="text-xs text-gray-400">{product.category}</span>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-bold">{product.name}</h3>
          </Link>

          <p className="text-xl font-light">${product.price}</p>
        </div>
      </motion.div>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl text-center">
              <X onClick={() => setShowLoginModal(false)} className="cursor-pointer" />
              <h2 className="text-xl font-bold mt-4">Login Required</h2>
              <p className="text-gray-600 mt-2">You must login to add items.</p>

              <button
                onClick={() => navigate('/login')}
                className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;