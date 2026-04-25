import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { 
  User, Mail, Lock, LogOut, Settings, 
  Package, Heart, CreditCard, Eye, EyeOff,
  ChevronRight, Calendar, Clock, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiUrl } from '../lib/apiService';
import { toast } from 'react-toastify';

type TabType = 'orders' | 'wishlist' | 'payments' | 'settings';

const Profile: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const navigate = useNavigate();
  const userEmail = user?.email || '';
  const userDisplayName = user?.fullName || userEmail.split('@')[0] || 'Account';

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const handlePendingCart = async () => {
      if (!isAuthenticated) return;
      const pendingProductId = localStorage.getItem('pending_add_to_cart');
      if (!pendingProductId) return;
      const redirectTo = localStorage.getItem('pending_add_redirect') || '/cart';
      localStorage.removeItem('pending_add_to_cart');
      localStorage.removeItem('pending_add_redirect');
      try {
        await addToCart(pendingProductId);
      } catch (err) {
        console.error('Failed to add pending item:', err);
      }
      navigate(redirectTo);
    };
    handlePendingCart();
  }, [isAuthenticated, addToCart, navigate]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(apiUrl('/orders'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(apiUrl('/auth/login'), { email, password });
      login(res.data.user.email, res.data.user.role, res.data.token, res.data.user.fullName);
      toast.success('Signed in successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileForm.fullName.trim()) {
      toast.warning('Name cannot be empty');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.email)) {
      toast.warning('Please enter a valid email address');
      return;
    }

    setSavingProfile(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(apiUrl('/users/profile'), profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      login(res.data.user.email, res.data.user.role, token!, res.data.user.fullName);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
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
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Forgot?
                </button>
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
        </motion.div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h3>
              <Button variant="ghost" size="sm" onClick={fetchOrders} className="text-gray-500 hover:text-black dark:hover:text-white">
                Refresh
              </Button>
            </div>
            
            {loadingOrders ? (
              <div className="py-20 text-center">
                <Clock className="mx-auto mb-4 animate-spin text-gray-300" size={32} />
                <p className="text-gray-500">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-neutral-800 text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-2xl mb-4 text-gray-300">
                  <Package size={32} />
                </div>
                <p className="text-gray-400 font-medium">You haven&apos;t placed any orders yet.</p>
                <Button onClick={() => navigate('/shop')} className="mt-6 bg-black dark:bg-white text-white dark:text-black rounded-full px-8">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 border border-gray-100 dark:border-neutral-800 hover:shadow-lg transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="font-bold text-gray-900 dark:text-white mt-0.5">${order.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-gray-400 flex items-center justify-end gap-1.5">
                            <Calendar size={12} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5 capitalize">{order.status}</p>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h3>
            
            <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-neutral-800 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                  <Input 
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl h-auto"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <Input 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="name@example.com"
                    type="email"
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl h-auto"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button disabled={savingProfile} type="submit" className="bg-black dark:bg-white text-white dark:text-black px-10 py-6 h-auto rounded-2xl font-bold active:scale-[0.98] transition-all">
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>

            <div className="bg-red-50 dark:bg-red-500/5 rounded-[2.5rem] p-10 border border-red-100 dark:border-red-900/20">
              <h4 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
              <p className="text-sm text-red-500/70 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl font-bold">
                Delete Account
              </Button>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Methods</h3>
            <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-neutral-800 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <CreditCard size={40} />
              </div>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Securely manage your saved credit cards and payment preferences for a faster checkout.</p>
              <Button className="bg-black dark:bg-white text-white dark:text-black rounded-full px-8">
                Add New Card
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
              <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-3xl flex items-center justify-center text-gray-400 relative">
                <User size={40} />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-neutral-900 rounded-full" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {userDisplayName}
                </h2>
                <p className="text-gray-500 font-medium truncate max-w-[150px]">{userEmail}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'orders', icon: <Package size={18} />, label: 'My Orders' },
                { id: 'wishlist', icon: <Heart size={18} />, label: 'Wishlist', path: '/wishlist' },
                { id: 'payments', icon: <CreditCard size={18} />, label: 'Payments' },
                { id: 'settings', icon: <Settings size={18} />, label: 'Account Settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    else setActiveTab(item.id as TabType);
                  }}
                  className={`w-full flex items-center space-x-4 px-6 py-4 text-sm font-medium rounded-2xl transition-all group ${
                    activeTab === item.id 
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span className={`${activeTab === item.id ? 'text-white dark:text-black' : 'text-gray-400 group-hover:text-black dark:group-hover:text-white'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-10 pt-10 border-t border-gray-100 dark:border-neutral-800">
              <button
                onClick={() => {
                  logout();
                  toast.info('Signed out');
                  navigate('/');
                }}
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
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-8"
        >
          {renderActiveTab()}
          
          {activeTab === 'orders' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-neutral-900 dark:bg-white rounded-[2.5rem] p-10 text-white dark:text-black">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Membership Status</h4>
                  <p className="text-4xl font-bold tracking-tight">Active Elite</p>
                </div>
                <div className="bg-gray-100 dark:bg-neutral-800 rounded-[2.5rem] p-10">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Total Orders</h4>
                  <p className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{orders.length}</p>
                </div>
             </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
