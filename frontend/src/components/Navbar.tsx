import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Sun, Moon, LogOut, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Dashboard', path: '/dashboard' });
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-100/50 dark:border-white/10 transition-colors duration-300"
    >
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
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.label}
                  to={item.path} 
                  className={`relative text-[11px] font-bold uppercase tracking-[0.2em] transition-colors group ${
                    isActive 
                      ? 'text-black dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  <motion.span 
                    className={`absolute -bottom-1 left-0 h-[1px] bg-black dark:bg-white transition-all ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    initial={false}
                  />
                </Link>
              );
            })}
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
              onClick={() => setIsSearchOpen(true)}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Search size={18} />
            </motion.button>
            <Link to="/wishlist" className="relative">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Heart size={18} />
                <AnimatePresence>
                  {wishlist.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
            <Link to={isAdmin ? "/dashboard" : "/profile"}>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <User size={18} />
              </motion.div>
            </Link>
            {user && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="hidden md:block p-3 text-red-500 hover:text-red-600 transition-colors"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </motion.button>
            )}
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
            <div className="px-4 py-8 space-y-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.label}
                    to={item.path} 
                    className={`block text-2xl font-bold tracking-tighter transition-colors ${
                      isActive 
                        ? 'text-black dark:text-white' 
                        : 'text-gray-400 dark:text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="w-12 h-[1px] bg-black dark:bg-white"
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
              {user && (
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-lg font-medium text-red-500"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-800 p-4 shadow-2xl"
          >
            <div className="max-w-3xl mx-auto flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search products, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-neutral-900 border border-transparent focus:border-gray-200 dark:focus:border-neutral-700 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none transition-all dark:text-white"
                />
              </form>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
