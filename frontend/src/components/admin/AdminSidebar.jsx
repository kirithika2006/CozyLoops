import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaChartLine,
  FaTags,
  FaBox,
  FaVideo,
  FaShoppingBag,
  FaHeart,
  FaComment,
  FaThumbsUp,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import { orderService } from '../../services/orderService';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = () => orderService.summary().then(result => { if (active) setNewOrders(result.summary?.newOrders || 0); }).catch(() => {});
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Home' },
    { path: '/admin/analytics', icon: FaChartLine, label: 'Analytics' },
    { path: '/admin/categories', icon: FaTags, label: 'Categories' },
    { path: '/admin/products', icon: FaBox, label: 'Products' },
    { path: '/admin/videos', icon: FaVideo, label: 'Videos' },
    { path: '/admin/orders', icon: FaShoppingBag, label: 'Orders' },
    { path: '/admin/wishlist', icon: FaHeart, label: 'Wishlist' },
    { path: '/admin/comments', icon: FaComment, label: 'Comments' },
    { path: '/admin/likes', icon: FaThumbsUp, label: 'Likes' },
    { path: '/admin/settings', icon: FaCog, label: 'Settings' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-navigation"
        className={`fixed top-0 left-0 h-full bg-white shadow-soft z-50 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } lg:block ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-primary-babyPink/20">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/cozyloops-trademark.png" alt={isOpen ? '' : 'cozy.loopsss_'} className={`${isOpen ? 'h-10 w-10' : 'h-9 w-9'} rounded-full object-cover`} />
            <span className="hidden">🧶</span>
            {isOpen && (
              <span className="font-display text-sm font-bold text-primary-rosePink">
                cozy.loopsss_
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-label={isOpen ? 'Close admin navigation' : 'Expand admin navigation'}
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg hover:bg-primary-babyPink/20 transition-colors"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-8rem)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => {
                if (window.matchMedia('(max-width: 1023px)').matches) setIsOpen(false);
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-pink text-white shadow-soft'
                    : 'hover:bg-primary-babyPink/20 text-secondary-dark/70 hover:text-secondary-dark'
                } ${!isOpen && 'justify-center'}`
              }
              title={!isOpen ? item.label : ''}
            >
              <item.icon className={`text-xl ${!isOpen && 'text-2xl'}`} />
              {isOpen && <span className="font-medium">{item.label}</span>}
              {item.label === 'Orders' && newOrders > 0 && <span className="ml-auto rounded-full bg-red-500 text-white text-xs min-w-5 h-5 px-1 flex items-center justify-center">{newOrders > 99 ? '99+' : newOrders}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-babyPink/20 bg-white">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            type="button"
            aria-label={isLoggingOut ? 'Logging out' : 'Logout'}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-50 text-secondary-dark/70 hover:text-red-500 ${
              !isOpen && 'justify-center'
            }`}
          >
            <FaSignOutAlt className="text-xl" />
            {isOpen && (
              <span className="font-medium">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
