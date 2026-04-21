import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { apiUrl } from '../lib/api';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(apiUrl(`/products/${id}`));
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product from API:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center dark:text-white">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Product not found</h2>
        <Link to="/shop" className="text-black dark:text-white font-bold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const getProductImage = (p: any) => {
    const name = (p?.name || '').toLowerCase();
    if (name.includes('brown suede casual loafers')) {
      return 'https://i.pinimg.com/736x/85/c0/28/85c028f0e6c4b2793900b0a40ef06dc8.jpg';
    }
    if (name.includes('glossy shine lip gloss')) {
      return 'https://i.pinimg.com/736x/99/1b/0f/991b0fdeb6f941aa3f907a7252ae5234.jpg';
    }
    return p?.image || p?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
  };

  const getProductDescription = (p: any) => {
    const name = (p?.name || '').toLowerCase();
    if (name.includes('brown suede casual loafers')) {
      return "Step into effortless style with our premium Brown Suede Casual Loafers. Designed for comfort and durability, these versatile shoes feature slip-on convenience and hand-stitched detailing, perfect for elevating your everyday casual look.";
    }
    if (name.includes('glossy shine lip gloss')) {
      return "Get that irresistible luminous finish with our Glossy Shine Lip Gloss. Enriched with hydrating oils, this non-sticky formula delivers long-lasting moisture and an ultra-glamorous, mirror-like shine to enhance your natural beauty.";
    }
    return p?.description;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-12"
      >
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl overflow-hidden bg-gray-100 dark:bg-neutral-800 aspect-square"
        >
          <img 
            src={getProductImage(product)} 
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
          <div className="mb-6 md:mb-8">
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>
            <p className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="prose prose-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            <p>{getProductDescription(product)}</p>
          </div>

          <div className="space-y-4 mb-12">
            <Button 
              onClick={() => addToCart(String(product.id || product._id))}
              className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center space-x-3 h-auto"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/profile')}
              className="w-full py-7 border-2 border-black dark:border-white text-black dark:text-white font-bold rounded-2xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all flex items-center justify-center space-x-3 h-auto"
            >
              <CreditCard size={20} />
              <span>Buy Now</span>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-gray-100 dark:border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-600 dark:text-gray-400">
                <Truck size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-600 dark:text-gray-400">
                <RotateCcw size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">30-Day Returns</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg text-gray-600 dark:text-gray-400">
                <Shield size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">2-Year Warranty</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products (Simple) */}
      <div className="mt-24 pt-24 border-t border-gray-100 dark:border-neutral-800">
        <h2 className="text-2xl font-bold mb-12 dark:text-white">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[]}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
