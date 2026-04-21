import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { User, Mail, Lock, LogOut, Settings, Package, Heart, CreditCard, Eye, EyeOff } from 'lucide-react';
import { apiUrl } from '../lib/api';

const Profile: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) return;

    const pendingProductId = localStorage.getItem('pending_add_to_cart');
    if (!pendingProductId) return;

    const redirectTo = localStorage.getItem('pending_add_redirect') || '/cart';

    localStorage.removeItem('pending_add_to_cart');
    localStorage.removeItem('pending_add_redirect');

    addToCart(pendingProductId);
    navigate(redirectTo);
  }, [isAuthenticated, addToCart, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(apiUrl('/auth/login'), { email, password });
      
      login(res.data.user.email, res.data.user.role, res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-neutral-800 shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white rounded-2xl mb-6 shadow-lg">
              <User size={32} className="text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Account</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to manage your orders and preferences.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl flex items-start gap-3 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                <Input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white h-auto dark:text-white transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Password</label>
                <button type="button" className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white h-auto dark:text-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="font-bold text-black dark:text-white hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-neutral-800 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Admin? Use your master credentials here
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated Profile View
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-8"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-neutral-800 shadow-xl">
            <div className="flex items-center space-x-6 mb-10">
              <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-3xl flex items-center justify-center text-gray-400">
                <User size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {typeof user?.email === 'string' ? user.email.split('@')[0] : 'Account'}
                </h2>
                <p className="text-gray-500 font-medium">{typeof user?.email === 'string' ? user.email : 'No email available'}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {user?.role ?? 'User'} Account
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { icon: <Package size={18} />, label: 'My Orders', path: '#' },
                { icon: <Heart size={18} />, label: 'Wishlist', path: '/wishlist' },
                { icon: <CreditCard size={18} />, label: 'Payments', path: '#' },
                { icon: <Settings size={18} />, label: 'Account Settings', path: '#' },
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className="w-full flex items-center space-x-4 px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-2xl transition-all group"
                >
                  <span className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{item.icon}</span>
                  <span className="group-hover:text-black dark:group-hover:text-white transition-colors">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-10 pt-10 border-t border-gray-100 dark:border-neutral-800">
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-4 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
              >
                <LogOut size={18} />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 space-y-8"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-neutral-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-black dark:bg-white" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Recent Orders</h3>
            
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-2xl mb-4 text-gray-300">
                <Package size={32} />
              </div>
              <p className="text-gray-400 font-medium">You haven&apos;t placed any orders yet.</p>
              <Button 
                onClick={() => navigate('/shop')}
                className="mt-6 bg-black dark:bg-white text-white dark:text-black rounded-full px-8"
              >
                Start Shopping
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-900 dark:bg-white rounded-[2.5rem] p-10 text-white dark:text-black">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Member Since</h4>
              <p className="text-4xl font-bold tracking-tight">August 2026</p>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-800 rounded-[2.5rem] p-10">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Total Spent</h4>
              <p className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">$0.00</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
