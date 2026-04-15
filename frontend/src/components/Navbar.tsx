import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ added useLocation
import { ShoppingCart, User, Menu, X, Search, Sun, Moon, LogOut, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const isLoggedIn = Boolean(user);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ current path

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    setIsProfileOpen(false);
    setShowProfileModal(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const openProfileModal = () => {
    setIsProfileOpen(false);
    setShowProfileModal(true);
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'N/A';

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

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.span
              whileHover={{ letterSpacing: '0.2em' }}
              className="text-2xl font-bold tracking-tighter text-black dark:text-white transition-all duration-500"
            >
              LUXE<span className="text-gray-400 font-light">CART</span>
            </motion.span>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative text-[11px] font-bold uppercase tracking-[0.2em] transition-colors group
                  ${
                    isActive
                      ? 'text-black dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}

                  {/* ✅ ACTIVE + HOVER UNDERLINE */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[1px] bg-black dark:bg-white transition-all duration-300
                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  />
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-2">

            {/* THEME */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>

            {/* SEARCH */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearch(!showSearch)}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <Search size={18} />
              </motion.button>

              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border p-4 z-50"
                  >
                    <form onSubmit={handleSearch} className="flex">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 px-4 py-3 bg-gray-50 border rounded-2xl"
                        autoFocus
                      />
                      <button className="ml-2 px-5 bg-black text-white rounded-2xl">
                        Go
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CART */}
            <Link to="/cart" className="relative">
              <motion.div className="p-3">
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute top-2 right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* MOBILE MENU */}
            <button
              className="md:hidden p-3"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;