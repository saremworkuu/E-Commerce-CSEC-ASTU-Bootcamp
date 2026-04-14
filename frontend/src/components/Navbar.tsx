import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

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
    setIsProfileOpen(false);
    setShowProfileModal(false);
    navigate('/');
  };

  const openProfileModal = () => {
    setIsProfileOpen(false);
    setShowProfileModal(true);
  };

  // Format join date
  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }) 
    : 'N/A';

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.span 
              whileHover={{ letterSpacing: "0.2em" }}
              className="text-2xl font-bold tracking-tighter text-black transition-all duration-500"
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
                className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors group"
              >
                {item}
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"
                  initial={false}
                />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-1">
            {/* Search */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearch(!showSearch)}
                className="p-3 text-gray-600 hover:text-black transition-colors"
              >
                <Search size={18} />
              </motion.button>

              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50"
                  >
                    <form onSubmit={handleSearch} className="flex">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black text-sm"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="ml-2 px-5 bg-black text-white rounded-2xl hover:bg-gray-800"
                      >
                        Go
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                            <User size={28} />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">
                              {user?.fullName}
                            </p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={openProfileModal}
                          className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-gray-50 text-sm"
                        >
                          <User size={18} />
                          My Profile
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full px-6 py-3 text-left flex items-center gap-3 hover:bg-gray-50 text-red-600 text-sm"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 text-gray-600 hover:text-black transition-colors"
                >
                  <User size={18} />
                </motion.div>
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 hover:text-black transition-colors"
              >
                <ShoppingCart size={18} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-2 right-2 bg-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Mobile Menu */}
            <button 
              className="md:hidden p-3 text-gray-600 hover:text-black transition-colors"
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
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-lg font-medium text-gray-900" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="block text-lg font-medium text-gray-900" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              <Link to="/contact" className="block text-lg font-medium text-gray-900" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0  bg-black/60 flex items-center justify-center z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 mt-100">
                <h2 className="text-2xl font-bold">My Profile</h2>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User size={40} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">
                      {user?.fullName}
                    </p>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={20} />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400">Member since</p>
                      <p className="font-medium">{joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-10 w-full py-4 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;