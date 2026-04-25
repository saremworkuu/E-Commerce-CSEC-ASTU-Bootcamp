import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { apiUrl } from '../lib/apiService';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No token provided.');
        return;
      }

      try {
        const response = await fetch(apiUrl('/auth/verify-email'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          if (data.token && data.user) {
             login(data.user.email, data.user.role, data.token);
             
             // Redirect to profile after a short delay
             setTimeout(() => navigate('/profile'), 2500);
          }
        } else {
          setStatus('error');
          setMessage(data.message || 'Failed to verify email.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-neutral-800 shadow-2xl text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-black dark:text-white animate-spin mb-6" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Verifying...</h1>
            <p className="text-gray-500 dark:text-gray-400">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Verified!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Redirecting to your account...</p>
            <Button 
              onClick={() => navigate('/profile')}
              className="w-full py-6 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl"
            >
              Go to Profile Now
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6">
              <XCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Verification Failed</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>
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

export default ConfirmEmail;
