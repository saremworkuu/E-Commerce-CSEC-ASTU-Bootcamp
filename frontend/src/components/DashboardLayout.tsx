import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Mail,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { apiUrl } from '../lib/apiService';

const DashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Validate token against local backend on mount — clears stale Render tokens
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('auth_user');
      window.location.href = '/admin';
      return;
    }
    axios.get(apiUrl('/auth/me'), {
      headers: { Authorization: `Bearer ${token}` }
    }).catch((err) => {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user');
        window.location.href = '/admin';
      }
    });
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
    { icon: <Package size={20} />, label: 'Products', path: '/dashboard/products' },
    { icon: <Users size={20} />, label: 'Users', path: '/dashboard/users' },
    { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/dashboard/orders' },
    { icon: <Mail size={20} />, label: 'Messages', path: '/dashboard/messages' },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tighter text-black dark:text-white">
            LUXE<span className="text-gray-400 font-light">CART</span>
          </span>
          <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
        </Link>
        <button 
          className="lg:hidden p-2 text-gray-500 hover:text-black dark:hover:text-white"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 pt-4">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Toggle admin theme"
          title="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <nav className="grow p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center space-x-3 mb-4 px-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold">
            {user?.email?.[0].toUpperCase() || 'A'}
          </div>
          <div className="grow overflow-hidden">
            <p className="text-xs font-bold truncate dark:text-white">{user?.email}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-70 w-72 bg-white dark:bg-neutral-900 shadow-2xl lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="grow flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 sticky top-0 z-50">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter text-black dark:text-white">
              LUXE<span className="text-gray-400 font-light">CART</span>
            </span>
          </Link>
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-black dark:hover:text-white"
              aria-label="Toggle admin theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-black dark:hover:text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="grow p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
