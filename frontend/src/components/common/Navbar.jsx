import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaShoppingCart, 
  FaHeart, 
  FaUserCircle,
  FaBars,
  FaTimes,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import AdminLoginModal from '../auth/AdminLoginModal';
import { OWNER_WHATSAPP_NUMBER } from '../../utils/constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
    { name: 'My Orders', path: '/my-orders' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-secondary-dark text-white shadow-lg transition-colors duration-200 ${
        isScrolled ? 'bg-secondary-dark' : 'bg-secondary-dark/95'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <img src="/cozyloops-trademark.png" alt="" className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12" />
                <span className="font-display text-lg font-bold text-white sm:text-xl">
                  cozy.loopsss_
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/90 hover:text-white transition-colors duration-200 font-medium relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-babyPink transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 rounded-full border border-white/30 bg-white px-4 py-2 text-secondary-dark placeholder:text-gray-500 focus:border-primary-babyPink focus:outline-none focus:ring-2 focus:ring-primary-babyPink/50 transition-colors duration-200"
                />
                <button type="submit" aria-label="Search products" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-darkPink">
                  <FaSearch />
                </button>
              </form>

              {/* Wishlist */}
              <Link to="/wishlist" aria-label="Wishlist" className="relative inline-flex h-10 w-10 items-center justify-center text-white hover:text-primary-babyPink transition-colors">
                <FaHeart className="text-xl" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-rosePink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" aria-label="Shopping cart" className="relative inline-flex h-10 w-10 items-center justify-center text-white hover:text-primary-babyPink transition-colors">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-rosePink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin */}
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="flex items-center gap-2 rounded-full border border-white/35 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-primary-babyPink hover:text-primary-babyPink"
              >
                <FaUserCircle className="text-2xl" />
                <span>Owner Login</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/15 bg-secondary-dark shadow-lg"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border border-white/30 bg-white px-4 py-3 text-secondary-dark focus:border-primary-babyPink focus:outline-none focus:ring-2 focus:ring-primary-babyPink/50 transition-colors duration-200"
                  />
                  <button type="submit" aria-label="Search products" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-darkPink">
                    <FaSearch />
                  </button>
                </form>

                {/* Mobile Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-white/90 hover:text-primary-babyPink transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Actions */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-4 border-t border-white/15 text-white">
                  <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                    <FaHeart className="text-xl" />
                    <span>Wishlist</span>
                    {getWishlistCount() > 0 && (
                      <span className="bg-primary-rosePink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getWishlistCount()}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                    <FaShoppingCart className="text-xl" />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="bg-primary-rosePink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsAdminModalOpen(true);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <FaUserCircle className="text-xl" />
                    <span>Owner Login</span>
                  </button>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-4 pt-4 border-t border-primary-babyPink/20">
                  <a href="https://instagram.com/cozy.loopsss_" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-babyPink transition-colors">
                    <FaInstagram className="text-xl" />
                  </a>
                  <a href={`https://wa.me/${OWNER_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-babyPink transition-colors">
                    <FaWhatsapp className="text-xl" />
                  </a>
                  <a href="mailto:cozyloopsss21@gmail.com" className="text-white hover:text-primary-babyPink transition-colors">
                    <FaEnvelope className="text-xl" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
