// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check token on app start / refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = res.data.user || res.data;
        setUser(userData);

        // Update stored user with fresh data
        localStorage.setItem('user', JSON.stringify(userData));

      } catch (error: any) {
        console.error('Auth verification failed:', error);

        // Only clear token on real auth errors (401/403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
        // For network errors, keep the user logged in (better UX)
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: any) => {
    const token = userData.token || userData.accessToken;
    const userToStore = userData.user || userData;

    if (token) localStorage.setItem('token', token);
    if (userToStore) {
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Optional: redirect to login
    window.location.href = '/login';
  };

  const isLoggedIn = !!user;
  const isAuthenticated = isLoggedIn;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isAuthenticated,
      isAdmin,
      user,
      loading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};