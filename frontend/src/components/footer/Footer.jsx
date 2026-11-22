import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaInstagram, 
  FaWhatsapp, 
  FaEnvelope, 
  FaFacebook, 
  FaPinterest,
  FaHeart,
  FaArrowRight
} from 'react-icons/fa';
import { OWNER_WHATSAPP_NUMBER } from '../../utils/constants';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
    { name: 'About Us', path: '/about' },
  ];

  const categories = [
    'Flowers',
    'Bouquets',
    'Keychains',
    'Phone Charms',
    'Plushies',
    'Personalized Gifts',
  ];

  const socialLinks = [
    { icon: FaInstagram, url: 'https://instagram.com/cozy.loopsss_', label: 'Instagram' },
    { icon: FaWhatsapp, url: `https://wa.me/${OWNER_WHATSAPP_NUMBER}`, label: 'WhatsApp' },
    { icon: FaEnvelope, url: 'mailto:cozyloopsss21@gmail.com', label: 'Email' },
    { icon: FaFacebook, url: '#', label: 'Facebook' },
    { icon: FaPinterest, url: '#', label: 'Pinterest' },
  ];

  return (
    <footer className="bg-gradient-to-b from-primary-lightPink/30 to-white pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">🧶</span>
              <span className="font-display text-2xl font-bold text-gradient">CozyLoops</span>
            </Link>
            <p className="text-secondary-dark/70 leading-relaxed">
              Handmade crochet creations crafted with care. Each piece is made with love and attention to detail.
            </p>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white rounded-full shadow-soft hover:shadow-premium transition-all duration-300 text-primary-rosePink"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold text-secondary-dark mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-secondary-dark/70 hover:text-primary-rosePink transition-colors duration-300 flex items-center group"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-lg font-bold text-secondary-dark mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/shop?category=${category.toLowerCase()}`}
                    className="text-secondary-dark/70 hover:text-primary-rosePink transition-colors duration-300"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* REMOVED: Newsletter Section */}
        </div>

        {/* Divider */}
        <div className="border-t border-primary-babyPink/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-dark/60 text-sm">
              © {new Date().getFullYear()} CozyLoops. Made with{' '}
              <FaHeart className="inline text-primary-rosePink animate-pulse" /> in India
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-secondary-dark/60 hover:text-primary-rosePink transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-secondary-dark/60 hover:text-primary-rosePink transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-secondary-dark/60 hover:text-primary-rosePink transition-colors">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
