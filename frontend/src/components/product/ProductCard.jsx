import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaStar, FaEye } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const {
    _id,
    name,
    description,
    images,
    price,
    discount,
    stock,
    isAvailable,
    averageRating,
    totalReviews,
    isNewArrival,
    isFeatured,
    isTrending
  } = product;

  const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
  const hasMultipleImages = images && images.length > 1;
  const isWishlisted = isInWishlist(_id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addToCart(product);
    } else {
      toast.error('This product is out of stock');
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      className="card-premium group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageIndex(0);
      }}
      whileHover={{ y: -8 }}
    >
      {/* Remove the outer Link and wrap only the image in Link */}
      <div className="block">
        {/* Image Container - Link only wraps the image */}
        <Link to={`/product/${_id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-primary-lightPink/20">
            {/* Main Image */}
            <motion.img
              src={images && images.length > 0 ? images[imageIndex].url : 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={name}
              className="w-full h-full object-cover transition-all duration-700"
              style={{ 
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
              loading="lazy"
            />

            {/* Multiple Image Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === imageIndex 
                        ? 'bg-primary-rosePink w-4' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                  {discount}% OFF
                </span>
              )}
              {isNewArrival && (
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                  New
                </span>
              )}
              {isFeatured && (
                <span className="px-3 py-1 bg-primary-rosePink text-white text-xs font-semibold rounded-full">
                  Featured
                </span>
              )}
              {isTrending && (
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                  🔥 Trending
                </span>
              )}
              {!isAvailable && (
                <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quick Actions - Visible on Hover */}
            <motion.div
              className="absolute top-3 right-3 flex flex-col gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleToggleWishlist}
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-soft hover:shadow-premium transition-all duration-300 hover:scale-110"
              >
                <FaHeart className={`text-lg ${isWishlisted ? 'text-primary-rosePink' : 'text-gray-400'}`} />
              </button>
              <Link
                to={`/product/${_id}`}
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-soft hover:shadow-premium transition-all duration-300 hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              >
                <FaEye className="text-lg text-gray-600" />
              </Link>
            </motion.div>

            {/* Add to Cart Button - Visible on Hover */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || stock === 0}
                className="w-full py-2.5 bg-white text-secondary-dark rounded-full font-semibold hover:bg-gradient-pink hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart className="text-sm" />
                {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </motion.div>
          </div>
        </Link>

        {/* Product Info - Not inside Link */}
        <div className="p-4 space-y-2">
          <Link to={`/product/${_id}`} className="block">
            <h3 className="font-semibold text-secondary-dark text-sm line-clamp-1 group-hover:text-primary-rosePink transition-colors">
              {name}
            </h3>
          </Link>
          
          <p className="text-secondary-dark/60 text-xs line-clamp-2">
            {description}
          </p>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 text-xs" />
                <span className="text-sm font-medium text-secondary-dark ml-1">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-secondary-dark/60">
                ({totalReviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-rosePink">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-secondary-dark/60 line-through">
                ₹{price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {stock > 0 && stock < 5 && (
            <p className="text-xs text-orange-500">Only {stock} left!</p>
          )}
          {stock > 5 && (
            <p className="text-xs text-green-500">In Stock</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;