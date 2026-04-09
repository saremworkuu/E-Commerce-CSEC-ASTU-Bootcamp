import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Register: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join LUXECART for a better shopping experience.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
            <Input 
              type="text" 
              placeholder="John Doe"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus-visible:ring-black h-auto"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
            <Input 
              type="email" 
              placeholder="name@example.com"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus-visible:ring-black h-auto"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus-visible:ring-black h-auto"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirm Password</label>
            <Input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus-visible:ring-black h-auto"
            />
          </div>

          <Button className="w-full py-7 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors">
            Create Account
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Already have an account? {' '}
            <Link to="/login" className="font-bold text-black hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
