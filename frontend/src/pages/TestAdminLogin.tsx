import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../lib/apiService';

const TestAdminLogin: React.FC = () => {
  const [email, setEmail] = useState('saremworkuu@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDebugEndpoint = async () => {
    setLoading(true);
    try {
      console.log('🔍 Testing debug endpoint...');
      console.log('🔍 Email:', email);
      console.log('🔍 Password:', password);
      
      const res = await axios.post(apiUrl('/debug/test-admin-login'), { email, password });
      
      console.log('🔍 Debug response:', res.data);
      setResult(res.data);
    } catch (error: any) {
      console.error('🔍 Debug error:', error);
      setResult({
        error: true,
        message: error.message,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const testRealEndpoint = async () => {
    setLoading(true);
    try {
      console.log('🔍 Testing real login endpoint...');
      console.log('🔍 Email:', email);
      console.log('🔍 Password:', password);
      
      const res = await axios.post(apiUrl('/auth/login'), { email, password });
      
      console.log('🔍 Real login response:', res.data);
      setResult(res.data);
    } catch (error: any) {
      console.error('🔍 Real login error:', error);
      setResult({
        error: true,
        message: error.message,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-black rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Admin Login Debug</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={testDebugEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Debug Endpoint'}
        </button>
        
        <button
          onClick={testRealEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Real Login'}
        </button>
      </div>
      
      {result && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
        <h3 className="font-bold mb-2">Expected Credentials:</h3>
        <p>Email: saremworkuu@gmail.com</p>
        <p>Password: admin123</p>
      </div>
    </div>
  );
};

export default TestAdminLogin;
