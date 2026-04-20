import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.user?.role !== 'admin') {
         setError('Access denied. Administrator privileges required.');
         return;
      }

      login(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-neutral-800 shadow-2xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={120} />
          </div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black mb-6 shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Admin Portal</h1>
            <p className="text-gray-500 dark:text-gray-400">Restricted access for platform administrators.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl flex items-start gap-3 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Admin Email</label>
              <Input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
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
              className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-xl disabled:opacity-70"
            >
              {loading ? 'Authorizing...' : 'Authorize Access'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Return to Website
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
