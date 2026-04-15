import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      login(res.data);        // This should update isLoggedIn and store token
      navigate('/');          // Go to home after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue shopping.</p>
        </div>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus-visible:ring-black h-auto"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus-visible:ring-black h-auto"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-7 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? {' '}
            <Link to="/register" className="font-bold text-black hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;