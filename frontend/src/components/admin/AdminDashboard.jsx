import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import AdminSidebar from './AdminSidebar';
import Analytics from './Analytics';
import Categories from './Categories';
import Products from './Products';
import Videos from './Videos';
import Orders from './Orders';
import WishlistAnalytics from './WishlistAnalytics';
import Comments from './Comments';
import Likes from './Likes';
import Settings from './Settings';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const syncSidebarToViewport = (event) => setIsSidebarOpen(event.matches);
    desktopQuery.addEventListener('change', syncSidebarToViewport);
    return () => desktopQuery.removeEventListener('change', syncSidebarToViewport);
  }, []);

  useEffect(() => {
    const isMobileDrawerOpen = isSidebarOpen && !window.matchMedia('(min-width: 1024px)').matches;
    if (!isMobileDrawerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsSidebarOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-gray">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />

        {/* Main Content */}
        <div 
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0 lg:ml-20'
          }`}
        >
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-primary-babyPink/30 bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open admin navigation"
              aria-expanded={isSidebarOpen}
              aria-controls="admin-navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-secondary-dark transition-colors hover:bg-primary-babyPink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-rosePink"
            >
              <FaBars className="text-xl" />
            </button>
            <span className="font-display font-semibold text-primary-rosePink">Admin dashboard</span>
          </header>

          <div className="p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<Analytics />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/products" element={<Products />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<WishlistAnalytics />} />
                <Route path="/comments" element={<Comments />} />
                <Route path="/likes" element={<Likes />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </Routes>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
