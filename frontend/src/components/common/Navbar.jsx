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
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-glass shadow-glass' : 'bg-transparent'
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
                <span className="text-3xl">🧶</span>
                <span className="font-display text-2xl font-bold text-gradient">
                  CozyLoops
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-secondary-dark hover:text-primary-rosePink transition-colors duration-300 font-medium relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-pink transition-all duration-300 group-hover:w-full"></span>
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
                  className="w-48 px-4 py-2 rounded-full border-2 border-primary-babyPink/30 focus:border-primary-rosePink focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-rosePink">
                  <FaSearch />
                </button>
              </form>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 hover:text-primary-rosePink transition-colors">
                <FaHeart className="text-xl" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-rosePink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:text-primary-rosePink transition-colors">
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
                className="p-2 hover:text-primary-rosePink transition-colors"
              >
                <FaUserCircle className="text-2xl" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary-babyPink/20 transition-colors"
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
              className="md:hidden bg-white/95 backdrop-blur-glass border-t border-primary-babyPink/20"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-full border-2 border-primary-babyPink/30 focus:border-primary-rosePink focus:outline-none transition-all duration-300"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-rosePink">
                    <FaSearch />
                  </button>
                </form>

                {/* Mobile Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-secondary-dark hover:text-primary-rosePink transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Actions */}
                <div className="flex items-center space-x-6 pt-4 border-t border-primary-babyPink/20">
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
                    <span>Admin</span>
                  </button>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-4 pt-4 border-t border-primary-babyPink/20">
                  <a href="https://instagram.com/cozy.loopsss_" target="_blank" rel="noopener noreferrer" className="hover:text-primary-rosePink transition-colors">
                    <FaInstagram className="text-xl" />
                  </a>
                  <a href="https://wa.me/919445084921" target="_blank" rel="noopener noreferrer" className="hover:text-primary-rosePink transition-colors">
                    <FaWhatsapp className="text-xl" />
                  </a>
                  <a href="mailto:cozyloopsss21@gmail.com" className="hover:text-primary-rosePink transition-colors">
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