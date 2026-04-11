import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
    { icon: <Package size={20} />, label: 'Products', path: '/dashboard/products' },
    { icon: <Users size={20} />, label: 'Users', path: '/dashboard/users' },
    { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/dashboard/orders' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-800">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter text-black dark:text-white">
              LUXE<span className="text-gray-400 font-light">CART</span>
            </span>
            <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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
              {user?.email[0].toUpperCase()}
            </div>
            <div className="flex-grow overflow-hidden">
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
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
