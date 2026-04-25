import React, { useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Lock, CheckCircle, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { apiUrl } from '../lib/apiService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setLoading(true);

    try {
      await axios.post(apiUrl('/auth/reset-password'), { token, password });
      setSuccess(true);
      // Automatically redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center p-12 bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl border border-red-100 dark:border-red-900/20 max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invalid Link</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">This password reset link is invalid or has expired. Please request a new one.</p>
          <Button onClick={() => navigate('/forgot-password')} className="w-full bg-black text-white dark:bg-white dark:text-black rounded-2xl py-6">
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-neutral-800 shadow-2xl"
      >
        {!success ? (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white rounded-2xl mb-6 shadow-lg">
                <Lock size={32} className="text-white dark:text-black" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">New Password</h1>
              <p className="text-gray-500 dark:text-gray-400">Please choose a strong password to secure your account.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">New Password</label>
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

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white h-auto dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : 'Reset Password'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-full mb-8">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Password Updated</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Your password has been reset successfully. You will be redirected to the login page in a moment.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full py-6 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl"
            >
              Sign In Now
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
