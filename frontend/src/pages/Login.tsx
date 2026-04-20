import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Save user in context (if backend sends user)
      login(data);

      // Redirect after login
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-neutral-800 shadow-xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to continue shopping.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-6">{error}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Forgot?
              </a>
            </div>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-black dark:text-white hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
