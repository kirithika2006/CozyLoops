import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            isSidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className="p-6">
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