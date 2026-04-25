import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { apiUrl, resolveImageUrl } from '../lib/apiService';

import { motion } from 'motion/react';
import { products as initialProducts } from '../data/products';

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(apiUrl('/products?limit=24'));
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch home products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ========================================================================
  // 🌟 FEATURED MASTERPIECES PRODUCTS 🌟
  // Change these names to force specific products into the Featured section.
  // Make sure the names match your actual product names in the database!
  // ========================================================================
  const featuredPriorityNames = [
    'Classic Brown Street Sneakers',
    'professional camera lens',
    'ergonomic office chair',
    'suit'
  ];

  const prioritizedFeatured = featuredPriorityNames
    .map((name) => products.find((product) => typeof product?.name === 'string' && product.name.toLowerCase().includes(name.toLowerCase())))
    .filter(Boolean);

  const featuredProducts = products.filter(p => p.featured);

  // Combine prioritized products with regular featured products, removing duplicates
  const displayFeatured = [
    ...prioritizedFeatured,
    ...featuredProducts.filter(p => !prioritizedFeatured.find(pf => (pf as any)._id === p._id)),
    ...products.slice(-6).reverse() // fallback
  ].slice(0, 3);




  const getProductId = (product: any) => product._id || product.id;
  const getProductName = (product: any) =>
    typeof product?.name === 'string' ? product.name : '';
  const getProductTitleParts = (product: any) => {
    const fullName = getProductName(product).trim();
    const firstSpaceIndex = fullName.indexOf(' ');

    if (firstSpaceIndex === -1) {
      return { main: fullName, rest: '' };
    }

    return {
      main: fullName.slice(0, firstSpaceIndex),
      rest: fullName.slice(firstSpaceIndex + 1),
    };
  };

  // ========================================================================
  // 🌟 FEATURED MASTERPIECES PICTURES 🌟
  // Change the URLs below to update the images in the Featured Masterpieces section.
  // ========================================================================
  const getFeaturedImage = (product: any) => {
    const name = getProductName(product).toLowerCase();

    // Featured Masterpieces overrides
    if (name.includes('ergonomic office chair')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('professional camera lens')) {
      return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('classic brown street sneakers') || name.includes('suit')) {
      return 'https://i.pinimg.com/736x/67/78/da/6778da93474832a08448a0a6bbe9a444.jpg';
    }

    return resolveImageUrl(product.image ||
      product.imageUrl ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
  };

  // ========================================================================
  // 🔥 EXCLUSIVE DEALS PICTURES 🔥
  // Change the URLs below to update the images in the Exclusive Deals section.
  // ========================================================================
  const getExclusiveDealImage = (product: any) => {
    const name = getProductName(product).toLowerCase();

    // Exclusive Deals overrides
    if (name.includes('brown suede casual loafers')) {
      return 'https://i.pinimg.com/736x/99/1b/0f/991b0fdeb6f941aa3f907a7252ae5234.jpg';
    }
    // Add any other specific overrides for Exclusive Deals here
    if (name.includes('glossy shine lip gloss')) {
      // Optional: Add a specific URL for the lip gloss if you want later.
      return resolveImageUrl(product.image || product.imageUrl);
    }

    return resolveImageUrl(product.image ||
      product.imageUrl ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
  };

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
    .map((name) => products.find((product) => getProductName(product).toLowerCase().includes(name)))
    .filter(Boolean);

  const topSellers = [
    ...prioritizedTopSellers,
    ...products.filter(
      (product) => !isPriorityTopSeller(getProductName(product))
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
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-gray-100 dark:bg-neutral-800 rounded-3xl animate-pulse" />
                <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-1/2 animate-pulse" />
              </div>
            ))
          ) : (
            displayFeatured.map((product) => (
              <ProductCard
                key={getProductId(product)}
                product={{ ...product, image: getFeaturedImage(product) }}
                priority={true}
              />
            ))


          )}
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
            className="relative h-100 sm:h-125 md:h-150 rounded-[2rem] sm:rounded-[3rem] overflow-hidden group"
          >
            <img
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=800&q=80"
              alt="Electronics"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12 md:p-16">
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
              className="relative h-75 sm:h-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                alt="Accessories"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
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
              className="relative h-75 sm:h-auto rounded-[2rem] sm:rounded-[3rem] overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
                alt="Furniture"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
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
          {/* Using reverse/slice to get 'older' products for home page as requested */}
          {products.slice(-4).reverse().map((product, i) => {

            const hasDiscount = product.originalPrice && product.originalPrice > product.price;
            const discount = hasDiscount
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            return (
              <Link
                to={`/product/${getProductId(product)}`}
                state={{ product }}
                key={getProductId(product)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 dark:bg-neutral-900 aspect-3/4 cursor-pointer"
                >
                  <img
                    src={getExclusiveDealImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                  />
                  {hasDiscount && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                      -{discount}% OFF
                    </div>
                  )}
                  {/* Text overlay removed as requested */}
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
                    {getProductTitleParts(product).main} <br /> <span className="text-gray-400 italic">{getProductTitleParts(product).rest}</span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 max-w-md leading-relaxed">
                    {getProductName(product).toLowerCase().includes('brown suede casual loafers')
                      ? "Step into effortless style with our premium Brown Suede Casual Loafers. Designed for comfort and durability, these versatile shoes feature slip-on convenience and hand-stitched detailing, perfect for elevating your everyday casual look."
                      : getProductName(product).toLowerCase().includes('glossy shine lip gloss')
                        ? "Get that irresistible luminous finish with our Glossy Shine Lip Gloss. Enriched with hydrating oils, this non-sticky formula delivers long-lasting moisture and an ultra-glamorous, mirror-like shine to enhance your natural beauty."
                        : product.description}
                  </p>
                  <Link
                    to={`/product/${getProductId(product)}`}
                    state={{ product }}
                    className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors group text-sm sm:text-base"
                  >
                    View Product
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </motion.div>
              </div>
              <div className="relative h-75 sm:h-100 lg:h-auto overflow-hidden group flex-1">
                <Link to={`/product/${getProductId(product)}`} state={{ product }} className="block w-full h-full">
                  <motion.img
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    src={getExclusiveDealImage(product)}
                    alt={getProductName(product)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
                    <span className="text-xs font-bold uppercase tracking-widest text-black">Top Seller</span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
