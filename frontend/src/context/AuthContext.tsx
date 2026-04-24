import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'user';

interface User {
  email: string;
  role: UserRole;
  fullName?: string;
}


interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, token?: string, fullName?: string) => void;

  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (!savedUser) return null;

    try {
      const parsedUser = JSON.parse(savedUser);
      const isValidEmail = typeof parsedUser?.email === 'string';
      const isValidRole = parsedUser?.role === 'admin' || parsedUser?.role === 'user';

      if (isValidEmail && isValidRole) {
        return parsedUser as User;
      }
    } catch (error) {
      // Ignore invalid JSON and clear stale auth below.
    }

    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
    return null;
  });

  const login = (email: string, role: UserRole, token?: string, fullName?: string) => {
    const newUser = { email, role, fullName };
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    if (token) {
      localStorage.setItem('token', token);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
