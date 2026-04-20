import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Wishlist: React.FC = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Wishlist & Favorites</h1>
        <p className="text-gray-500 dark:text-gray-400">Products you&apos;ve favorited and saved for later.</p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
          <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            Save items you like to your wishlist so you can find them later.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform duration-300"
          >
            <ShoppingBag size={20} className="mr-2" />
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
