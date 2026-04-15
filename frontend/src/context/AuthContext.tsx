import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
  loading: boolean;        // Added for better UX
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile when token exists
  const fetchUserProfile = async (token: string) => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch user profile');
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('token', userData.token);
    setUser(userData.user || userData);   // Handle both response formats
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};