import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { apiUrl } from '../lib/api';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(apiUrl('/products'));
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch home products:', err);
      }
    };
    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  // If we don't have enough featured, fallback to newest
  const displayFeatured = featuredProducts.length >= 3 ? featuredProducts : products.slice(0, 3);

  const getProductId = (product: any) => product.id || product._id;
  const getProductImage = (product: any) =>
    product.image ||
    product.imageUrl ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

  const topSellerPriorityNames = [
    'brown suede casual loafers',
    'glossy shine lip gloss',
  ];

  const isPriorityTopSeller = (productName: string = '') => {
    const normalizedName = productName.toLowerCase();
    return topSellerPriorityNames.some(
      (targetName) => normalizedName === targetName || normalizedName.includes(targetName)
    );
  };

  const prioritizedTopSellers = topSellerPriorityNames
    .map((name) => products.find((product) => (product.name || '').toLowerCase().includes(name)))
    .filter(Boolean);

  const topSellers = [
    ...prioritizedTopSellers,
    ...products.filter(
      (product) => !isPriorityTopSeller(product.name || '')
    ),
  ].slice(0, 2);

  return (
    <div className="space-y-16 pb-16">
      {/* Cinematic Hero Slider */}
      <HeroSlider />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { icon: <ShoppingBag size={24} />, title: "Premium Quality", desc: "Crafted with the finest materials" },
            { icon: <Truck size={24} />, title: "Free Shipping", desc: "On all orders over $150" },
            { icon: <RotateCcw size={24} />, title: "Easy Returns", desc: "30-day hassle-free returns" },
            { icon: <ShieldCheck size={24} />, title: "Secure Payment", desc: "100% encrypted transactions" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="p-8 sm:p-10 bg-gray-50 dark:bg-white/5 rounded-[2rem] sm:rounded-[2.5rem] text-center group hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white dark:bg-black rounded-2xl shadow-sm text-black dark:text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-400 dark:group-hover:text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-3 block">Curated Selection</span>
            <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">Featured Masterpieces</h2>
          </motion.div>
          <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest text-black dark:text-white hover:underline group">
            Explore All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayFeatured.map((product) => (
            <ProductCard key={product.id || (product as any)._id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories - Cinematic Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden group"
          >
            <img 
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=800&q=80" 
              alt="Electronics" 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12 md:p-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2 sm:mb-4 block">Innovation</span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tighter">Electronics</h3>
              <Link to="/shop?category=Electronics" className="inline-flex items-center text-white font-bold uppercase tracking-widest text-xs group">
                View Collection <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <div className="grid grid-rows-1 sm:grid-rows-2 gap-8 sm:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative h-[300px] sm:h-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden group"
            >
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" 
                alt="Accessories" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tighter">Accessories</h3>
                <Link to="/shop?category=Accessories" className="inline-flex items-center text-white font-bold uppercase tracking-widest text-xs group">
                  Explore <ArrowRight size={16} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative h-[300px] sm:h-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden group"
            >
              <img 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80" 
                alt="Furniture" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tighter">Furniture</h3>
                <Link to="/shop?category=Furniture" className="inline-flex items-center text-white font-bold uppercase tracking-widest text-xs group">
                  Explore <ArrowRight size={16} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Limited Time Deals Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-3 block">Limited Time Offers</span>
            <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">Exclusive Deals</h2>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.slice(0, 4).map((product, i) => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.price;
            const discount = hasDiscount
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            return (
              <Link 
                to={`/product/${getProductId(product)}`}
                key={getProductId(product)}
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 dark:bg-neutral-900 aspect-[3/4] cursor-pointer"
                >
                  <img 
                    src={getProductImage(product)} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                    {hasDiscount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{discount}% OFF
                      </div>
                    )}
                    <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold">${product.price.toFixed(2)}</span>
                      {hasDiscount && (
                        <span className="text-gray-300 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="mt-4 text-white text-xs font-bold uppercase tracking-widest group-hover:underline">
                      View Deal
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-3 block">Best of the Month</span>
            <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">Top Sellers</h2>
          </motion.div>
        </div>
        <div className="space-y-8 sm:space-y-12">
          {topSellers.map((product, index) => (
            <div key={getProductId(product)} className={`bg-gray-50 dark:bg-white/5 rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-3 sm:mb-4 block">Rank #{index + 1}</span>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white mb-4 sm:mb-6 leading-none">
                    {product.name.split(' ')[0]} <br /> <span className="text-gray-400 italic">{product.name.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 max-w-md leading-relaxed">
                    {product.description}
                  </p>
                  <Link 
                    to={`/product/${getProductId(product)}`}
                    className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors group text-sm sm:text-base"
                  >
                    View Product
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </motion.div>
              </div>
              <div className="relative h-[300px] sm:h-[400px] lg:h-auto overflow-hidden group flex-1">
                <motion.img 
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                  src={getProductImage(product)} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-black">Top Seller</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
