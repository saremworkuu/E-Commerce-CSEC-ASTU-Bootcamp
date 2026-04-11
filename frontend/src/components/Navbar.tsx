import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-100/50 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.span 
              whileHover={{ letterSpacing: "0.2em" }}
              className="text-2xl font-bold tracking-tighter text-black dark:text-white transition-all duration-500"
            >
              LUXE<span className="text-gray-400 font-light">CART</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {['Home', 'Shop', 'Contact'].map((item) => (
              <Link 
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors group"
              >
                {item}
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black dark:bg-white transition-all group-hover:w-full"
                  initial={false}
                />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Search size={18} />
            </motion.button>
            <Link to="/login">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <User size={18} />
              </motion.div>
            </Link>
            <Link to="/cart" className="relative group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <ShoppingCart size={18} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 bg-black dark:bg-white text-white dark:text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
            <button 
              className="md:hidden p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-black border-t border-gray-100 dark:border-white/10 overflow-hidden transition-colors duration-300"
          >
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/" 
                className="block text-lg font-medium text-gray-900 dark:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="block text-lg font-medium text-gray-900 dark:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/contact" 
                className="block text-lg font-medium text-gray-900 dark:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
