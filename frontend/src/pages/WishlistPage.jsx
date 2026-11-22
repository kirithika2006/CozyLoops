import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import { Helmet } from 'react-helmet-async';

const WishlistPage = () => {
  const { wishlistItems, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => addToCart(item));
  };

  if (wishlistItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist - cozy.loopsss_</title>
        </Helmet>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">💕</div>
            <h2 className="font-display text-3xl font-bold text-secondary-dark mb-3">
              Your Wishlist is Empty
            </h2>
            <p className="text-secondary-dark/60 mb-8">
              Save your favorite items here by clicking the heart icon on any product.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Wishlist - cozy.loopsss_</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-secondary-dark">
              My Wishlist
            </h1>
            <p className="text-secondary-dark/60">
              {wishlistItems.length} items saved
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddAllToCart}
            >
              <FaShoppingCart className="mr-2" />
              Add All to Cart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearWishlist}
              className="text-red-500 hover:text-red-600"
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default WishlistPage;