import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/common/Navbar';
import Footer from './components/footer/Footer';
import ScrollProgress from './components/common/ScrollProgress';
import BackToTop from './components/common/BackToTop';
import AnimatedCursor from './components/common/AnimatedCursor';
import LoadingSpinner from './components/common/LoadingSpinner';
import AdminDashboard from './components/admin/AdminDashboard';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  // Check if current page is homepage
  const isHomePage = location.pathname === '/';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <AdminProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen bg-white dark:bg-secondary-light">
            {!isAdminRoute && <AnimatedCursor />}
            {!isAdminRoute && <ScrollProgress />}
            {!isAdminRoute && <Navbar />}
            
            <main className={!isAdminRoute ? 'pt-16' : ''}>
              <AnimatePresence mode="wait">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AnimatePresence>
            </main>

            {!isAdminRoute && <Footer />}
            {/* Show BackToTop on all pages except homepage */}
            {!isAdminRoute && !isHomePage && <BackToTop />}
            
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#FFE4E1',
                  color: '#333',
                  borderRadius: '1rem',
                  padding: '1rem',
                },
                success: {
                  style: {
                    background: '#90EE90',
                  },
                },
                error: {
                  style: {
                    background: '#FF6B6B',
                    color: '#fff',
                  },
                },
              }}
            />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;