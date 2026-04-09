import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  return (
    <div className="space-y-24 pb-24">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Layer with Ken Burns Effect */}
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&q=80" 
            alt="Cinematic Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Dramatic Lighting Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </motion.div>

        {/* Centered Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span 
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="text-xs md:text-sm font-bold uppercase text-gray-400 mb-6 block"
            >
              A New Era of Luxury
            </motion.span>
            
            <h1 className="text-5xl md:text-9xl font-bold tracking-tighter text-white leading-[0.9] mb-10">
              ESSENCE <br />
              <span className="text-gray-500 italic font-light">REDEFINED</span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            >
              Experience the intersection of cinematic design and premium craftsmanship. 
              Curated for those who appreciate the finer details of life.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link 
                to="/shop" 
                className="group relative px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-all duration-500 hover:pr-14"
              >
                <span className="relative z-10">Explore Collection</span>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500" size={20} />
              </Link>
              <Link 
                to="/contact" 
                className="px-10 py-5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Scroll to discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              className="p-10 bg-gray-50 rounded-[2.5rem] text-center group hover:bg-black hover:text-white transition-all duration-500"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-sm text-black mb-6 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-3 block">Curated Selection</span>
            <h2 className="text-5xl font-bold tracking-tighter text-gray-900">Featured Masterpieces</h2>
          </motion.div>
          <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest text-black hover:underline group">
            Explore All <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories - Cinematic Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden group"
          >
            <img 
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=800&q=80" 
              alt="Electronics" 
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Innovation</span>
              <h3 className="text-5xl font-bold text-white mb-6 tracking-tighter">Electronics</h3>
              <Link to="/shop?category=Electronics" className="inline-flex items-center text-white font-bold uppercase tracking-widest text-xs group">
                View Collection <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <div className="grid grid-rows-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative rounded-[3rem] overflow-hidden group"
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
              className="relative rounded-[3rem] overflow-hidden group"
            >
              <img 
                src="https://images.unsplash.com/photo-1505843490701-5be5d0b19d58?auto=format&fit=crop&w=800&q=80" 
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-3 block">Limited Time Offers</span>
            <h2 className="text-5xl font-bold tracking-tighter text-gray-900">Exclusive Deals</h2>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.filter(p => p.originalPrice).slice(0, 4).map((product, i) => {
            const discount = Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100);
            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-3xl overflow-hidden bg-gray-100 aspect-[3/4]"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{discount}% OFF
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">${product.price.toFixed(2)}</span>
                    <span className="text-gray-300 text-sm line-through">${product.originalPrice?.toFixed(2)}</span>
                  </div>
                  <Link to={`/product/${product.id}`} className="mt-4 text-white text-xs font-bold uppercase tracking-widest hover:underline">
                    View Deal
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-3 block">Best of the Month</span>
            <h2 className="text-5xl font-bold tracking-tighter text-gray-900">Top Sellers</h2>
          </motion.div>
        </div>
        <div className="space-y-12">
          {products.slice(0, 2).map((product, index) => (
            <div key={product.id} className={`bg-gray-50 rounded-[3rem] overflow-hidden flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
              <div className="p-12 md:p-24 flex flex-col justify-center flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Rank #{index + 1}</span>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 mb-8 leading-none">
                    {product.name.split(' ')[0]} <br /> <span className="text-gray-400 italic">{product.name.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <p className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
                    {product.description}
                  </p>
                  <Link 
                    to={`/product/${product.id}`}
                    className="inline-flex items-center justify-center px-10 py-5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors group"
                  >
                    View Product
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </motion.div>
              </div>
              <div className="relative h-[400px] lg:h-auto overflow-hidden group flex-1">
                <motion.img 
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                  src={product.image} 
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
