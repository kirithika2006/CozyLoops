import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBox, 
  FaVideo, 
  FaHeart, 
  FaComment, 
  FaTags, 
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaShoppingBag
} from 'react-icons/fa';
import { analyticsService } from '../../services/analyticsService';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getAnalytics();
        setAnalytics(response.analytics);
        
        const statsResponse = await analyticsService.getDailyStats(7);
        setDailyStats(statsResponse.stats || []);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
        // Set default empty data
        setAnalytics({
          totalProducts: 0,
          totalVideos: 0,
          totalLikes: 0,
          totalComments: 0,
          totalCategories: 0,
          totalWishlist: 0,
          latestUploads: { products: [], videos: [] }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      icon: FaBox,
      label: 'Total Products',
      value: analytics?.totalProducts || 0,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      icon: FaVideo,
      label: 'Total Videos',
      value: analytics?.totalVideos || 0,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    {
      icon: FaHeart,
      label: 'Total Likes',
      value: analytics?.totalLikes || 0,
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: FaComment,
      label: 'Total Comments',
      value: analytics?.totalComments || 0,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      icon: FaTags,
      label: 'Categories',
      value: analytics?.totalCategories || 0,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    {
      icon: FaStar,
      label: 'Wishlist Items',
      value: analytics?.totalWishlist || 0,
      color: 'text-pink-500',
      bg: 'bg-pink-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-secondary-dark">
          Analytics Dashboard
        </h2>
        <p className="text-secondary-dark/60">Overview of your cozy.loopsss_ store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-premium p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-dark/60">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-dark mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Latest Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Products */}
        <div className="card-premium p-6">
          <h3 className="font-display text-lg font-bold text-secondary-dark mb-4">
            Latest Products
          </h3>
          {analytics?.latestUploads?.products?.length > 0 ? (
            <div className="space-y-3">
              {analytics.latestUploads.products.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-babyPink/10 transition-colors">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-dark text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-secondary-dark/60">
                      ₹{product.price?.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-xs text-secondary-dark/40">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-dark/60 text-center py-4">No products uploaded yet</p>
          )}
        </div>

        {/* Latest Videos */}
        <div className="card-premium p-6">
          <h3 className="font-display text-lg font-bold text-secondary-dark mb-4">
            Latest Videos
          </h3>
          {analytics?.latestUploads?.videos?.length > 0 ? (
            <div className="space-y-3">
              {analytics.latestUploads.videos.slice(0, 5).map((video) => (
                <div key={video._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-babyPink/10 transition-colors">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-dark text-sm truncate">
                      {video.title}
                    </p>
                    <p className="text-xs text-secondary-dark/60">
                      {video.likes || 0} likes
                    </p>
                  </div>
                  <span className="text-xs text-secondary-dark/40">
                    {new Date(video.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-dark/60 text-center py-4">No videos uploaded yet</p>
          )}
        </div>
      </div>

      {/* Daily Stats Chart (Simplified) */}
      {dailyStats && dailyStats.length > 0 && (
        <div className="card-premium p-6">
          <h3 className="font-display text-lg font-bold text-secondary-dark mb-4">
            Activity (Last 7 Days)
          </h3>
          <div className="flex items-end gap-2 h-32">
            {dailyStats.map((stat, index) => {
              const maxViews = Math.max(...dailyStats.map(s => s.views || 0), 1);
              const height = ((stat.views || 0) / maxViews) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-gradient-pink rounded-t-lg transition-all duration-500"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <span className="text-xs text-secondary-dark/60">
                    {new Date(stat.date).toLocaleDateString('en', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <p className="text-sm text-secondary-dark/40 text-center">
        Last updated: {analytics?.updatedAt ? new Date(analytics.updatedAt).toLocaleString() : 'Never'}
      </p>
    </div>
  );
};

export default Analytics;