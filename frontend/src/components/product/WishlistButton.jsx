import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';

const WishlistButton = ({ product, className = '', size = 'md' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);

  const sizes = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg',
  };

  return (
    <motion.button
      onClick={() => toggleWishlist(product)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`${sizes[size]} rounded-full transition-all duration-300 ${
        isWishlisted
          ? 'bg-primary-rosePink text-white shadow-soft'
          : 'bg-white/80 backdrop-blur-sm text-secondary-dark border-2 border-gray-200 hover:border-primary-rosePink'
      } ${className}`}
    >
      <FaHeart className={isWishlisted ? 'fill-current' : ''} />
    </motion.button>
  );
};

export default WishlistButton;