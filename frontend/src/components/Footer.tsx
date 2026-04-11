import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { motion } from 'motion/react';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-white/10 pt-12 pb-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand & Social */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tighter text-black dark:text-white">
                LUXE<span className="text-gray-400 font-light">CART</span>
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              Elevating your lifestyle with curated collections and premium essentials. Quality meets modern design.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="lg:pl-12">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black dark:text-white mb-8">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link to="/shop?category=Electronics" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Electronics</Link></li>
              <li><Link to="/shop?category=Accessories" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Accessories</Link></li>
              <li><Link to="/shop?category=Furniture" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Furniture</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:pl-12">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black dark:text-white mb-8">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Contact</Link></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Sustainability</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest">
            © 2026 LUXECART. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white text-[10px] uppercase tracking-widest transition-colors">Terms</a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white text-[10px] uppercase tracking-widest transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white text-[10px] uppercase tracking-widest transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
