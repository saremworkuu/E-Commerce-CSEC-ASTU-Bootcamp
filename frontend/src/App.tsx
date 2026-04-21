import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/profile';
import Register from './pages/Register';
import Contact from './pages/Contact';
import About from './pages/About';
import Wishlist from './pages/Wishlist';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import DashboardProducts from './pages/DashboardProducts';
import DashboardProductNew from './pages/DashboardProductNew';
import DashboardUsers from './pages/DashboardUsers';
import DashboardOrders from './pages/DashboardOrders';
import { AnimatePresence, motion } from 'motion/react';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetails /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminLogin /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        
        {/* Admin Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="products/new" element={<DashboardProductNew />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="orders" element={<DashboardOrders />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAccount = location.pathname === '/login' || location.pathname === '/profile' || location.pathname === '/register';
  const isAdminLogin = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      {!isDashboard && !isAdminLogin && <Navbar />}
      <main className="grow">
        <AnimatedRoutes />
      </main>
      {!isDashboard && !isAccount && !isAdminLogin && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <AppContent />
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
