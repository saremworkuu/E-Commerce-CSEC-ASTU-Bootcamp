import React, { useState } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { apiUrl } from '../lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(apiUrl('/auth/forgot-password'), { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
        {!success ? (
          <>
            <div className="text-center mb-10">
              <button 
                onClick={() => navigate('/login')}
                className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Login
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Forgot Password</h1>
              <p className="text-gray-500 dark:text-gray-400">Enter your email and we&apos;ll send you a link to reset your password.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : 'Send Reset Link'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-full mb-8">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Check your email</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              If an account exists with <b>{email}</b>, we have sent a password reset link. Please check your inbox and spam folder.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full py-6 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl"
            >
              Back to Login
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
