import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No token provided.');
        return;
      }

      try {
        const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
        const verificationEndpoint = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;

        const response = await fetch(`${verificationEndpoint}/auth/verify-email`, {
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
          // Optionally, login the user automatically if backend sends token
          if (data.token) {
             localStorage.setItem('token', data.token);
             if (data.user) {
               localStorage.setItem('user', JSON.stringify(data.user));
             }
             // Small delay before redirecting to home/shop
             setTimeout(() => navigate('/'), 2000);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-green-600">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <p className="text-lg font-medium mb-4">{message}</p>
            <p className="text-sm text-gray-500 mb-6">You will be redirected shortly...</p>
            <Link to="/" className="text-primary hover:underline">Go to Home</Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-destructive">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <p className="text-lg font-medium mb-4">{message}</p>
            <Link to="/login" className="text-primary hover:underline">Go to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
