import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaBox, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { productService } from '../../services/productService';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const WishlistAnalytics = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all products
        const response = await productService.getProducts({ limit: 100 });
        setProducts(response.products || []);
        
        // Load wishlist from localStorage
        const savedWishlist = localStorage.getItem('cozyloops_wishlist');
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
        toast.error('Failed to load wishlist data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate wishlist statistics
  const totalWishlistItems = wishlistItems.length;
  const uniqueProducts = new Set(wishlistItems.map(item => item._id)).size;
  
  // Get most wished products
  const productWishlistCount = {};
  wishlistItems.forEach(item => {
    productWishlistCount[item._id] = (productWishlistCount[item._id] || 0) + 1;
  });

  const sortedProducts = Object.entries(productWishlistCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const mostWishedProducts = sortedProducts.map(([id, count]) => {
    const product = products.find(p => p._id === id);
    return { ...product, wishlistCount: count };
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-secondary-dark">
          Wishlist Analytics
        </h2>
        <p className="text-secondary-dark/60">Track what your customers love</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-premium p-6">
          <p className="text-sm text-secondary-dark/60">Total Wishlist Items</p>
          <p className="text-3xl font-bold text-secondary-dark">
            {totalWishlistItems}
          </p>
        </div>
        <div className="card-premium p-6">
          <p className="text-sm text-secondary-dark/60">Unique Products</p>
          <p className="text-3xl font-bold text-secondary-dark">
            {uniqueProducts}
          </p>
        </div>
        <div className="card-premium p-6">
          <p className="text-sm text-secondary-dark/60">Avg. Items per User</p>
          <p className="text-3xl font-bold text-secondary-dark">
            {(totalWishlistItems / Math.max(1, uniqueProducts)).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Most Wished Products */}
      <div className="card-premium p-6">
        <h3 className="font-display text-lg font-bold text-secondary-dark mb-4">
          Most Wished Products
        </h3>
        {mostWishedProducts.length > 0 ? (
          <div className="space-y-3">
            {mostWishedProducts.map((product, index) => (
              <div key={product?._id || index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-babyPink/10 transition-colors">
                <div className="w-8 h-8 bg-primary-babyPink/20 rounded-full flex items-center justify-center text-sm font-bold text-primary-rosePink">
                  #{index + 1}
                </div>
                <img
                  src={product?.images?.[0]?.url || 'https://via.placeholder.com/40'}
                  alt={product?.name || 'Product'}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary-dark truncate">
                    {product?.name || 'Unknown Product'}
                  </p>
                  <p className="text-sm text-secondary-dark/60">
                    ₹{product?.price?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeart className="text-primary-rosePink" />
                  <span className="font-semibold">{product?.wishlistCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary-dark/60 text-center py-4">
            No items in wishlist yet
          </p>
        )}
      </div>

      {/* All Wishlist Items */}
      <div className="card-premium p-6">
        <h3 className="font-display text-lg font-bold text-secondary-dark mb-4">
          All Wishlist Items ({totalWishlistItems})
        </h3>
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {wishlistItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-babyPink/10 transition-colors">
                <img
                  src={item.images?.[0]?.url || 'https://via.placeholder.com/30'}
                  alt={item.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-sm truncate flex-1">{item.name}</span>
                <span className="text-xs text-secondary-dark/60">₹{item.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary-dark/60 text-center py-4">
            No items in wishlist
          </p>
        )}
      </div>
    </div>
  );
};

export default WishlistAnalytics;