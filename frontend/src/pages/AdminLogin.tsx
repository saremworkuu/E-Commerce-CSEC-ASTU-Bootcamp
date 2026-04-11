import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Copy, Check } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState<'email' | 'pass' | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'admin@luxecart.com';
  const ADMIN_PASS = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      login(email, 'admin');
      navigate('/dashboard');
    } else {
      alert('Invalid admin credentials');
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'pass') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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
            <p className="text-gray-500 dark:text-gray-400">Secure access for platform administrators.</p>
          </div>

          {/* Credentials Box */}
          <div className="mb-8 p-6 bg-gray-50 dark:bg-neutral-800/50 rounded-3xl border border-gray-100 dark:border-neutral-800">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Master Credentials</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between group">
                <code className="text-sm font-mono text-black dark:text-white">{ADMIN_EMAIL}</code>
                <button 
                  onClick={() => copyToClipboard(ADMIN_EMAIL, 'email')}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  {copied === 'email' ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                </button>
              </div>
              <div className="flex items-center justify-between group">
                <code className="text-sm font-mono text-black dark:text-white">{ADMIN_PASS}</code>
                <button 
                  onClick={() => copyToClipboard(ADMIN_PASS, 'pass')}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  {copied === 'pass' ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

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
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
                required
              />
            </div>

            <Button type="submit" className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-xl hover:shadow-black/20 dark:hover:shadow-white/10">
              Authorize Access
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Return to User Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
