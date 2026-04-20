import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', {
        fullName,
        email,
        password
      });
      setMessage({ type: 'success', text: res.data.message });
      // Optionally redirect after a few seconds or let the user click sign in
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to register' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-neutral-800 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">Join LUXECART for a better shopping experience.</p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
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
                required
                className="w-full px-6 pr-14 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
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
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirm Password</label>
            <div className="relative group">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-6 pr-14 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {message.text && (
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
              ) : (
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Already have an account? {' '}
            <Link to="/login" className="font-bold text-black dark:text-white hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
