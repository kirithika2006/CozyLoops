import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaVideo, FaBox, FaCalendar, FaSearch } from 'react-icons/fa';
import { videoService } from '../../services/videoService';
import { productService } from '../../services/productService';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const Likes = () => {
  const [videoLikes, setVideoLikes] = useState([]);
  const [productLikes, setProductLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      // Fetch videos with likes
      const videosResponse = await videoService.getVideos({ limit: 50 });
      const videosWithLikes = videosResponse.videos?.filter(v => v.likes > 0) || [];
      setVideoLikes(videosWithLikes.sort((a, b) => b.likes - a.likes));

      // Fetch products with likes (using wishlist as proxy)
      const productsResponse = await productService.getProducts({ limit: 50 });
      const productsWithLikes = productsResponse.products?.filter(p => p.wishlistCount > 0) || [];
      setProductLikes(productsWithLikes.sort((a, b) => b.wishlistCount - a.wishlistCount));
    } catch (error) {
      console.error('Error fetching likes:', error);
      toast.error('Failed to load likes data');
    } finally {
      setLoading(false);
    }
  };

  const totalVideoLikes = videoLikes.reduce((sum, v) => sum + (v.likes || 0), 0);
  const totalProductLikes = productLikes.reduce((sum, p) => sum + (p.wishlistCount || 0), 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-secondary-dark">
          Likes Analytics
        </h2>
        <p className="text-secondary-dark/60">Track engagement across your content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-premium p-6">
          <div className="flex items-center gap-3">
            <FaVideo className="text-purple-500 text-2xl" />
            <div>
              <p className="text-sm text-secondary-dark/60">Total Video Likes</p>
              <p className="text-2xl font-bold text-secondary-dark">{totalVideoLikes}</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-6">
          <div className="flex items-center gap-3">
            <FaBox className="text-blue-500 text-2xl" />
            <div>
              <p className="text-sm text-secondary-dark/60">Total Product Likes</p>
              <p className="text-2xl font-bold text-secondary-dark">{totalProductLikes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'videos'
              ? 'text-primary-rosePink border-b-2 border-primary-rosePink'
              : 'text-secondary-dark/60 hover:text-secondary-dark'
          }`}
        >
          <FaVideo className="inline mr-2" />
          Videos ({videoLikes.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'products'
              ? 'text-primary-rosePink border-b-2 border-primary-rosePink'
              : 'text-secondary-dark/60 hover:text-secondary-dark'
          }`}
        >
          <FaBox className="inline mr-2" />
          Products ({productLikes.length})
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'videos' && (
          videoLikes.length === 0 ? (
            <div className="glass-morphism rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-2xl font-display text-secondary-dark mb-2">
                No Video Likes Yet
              </h3>
              <p className="text-secondary-dark/60">
                Videos will appear here once they receive likes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {videoLikes.map((video) => (
                <div key={video._id} className="card-premium p-4 flex items-center gap-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-secondary-dark truncate">
                      {video.title}
                    </p>
                    <p className="text-sm text-secondary-dark/60 truncate">
                      {video.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaThumbsUp className="text-primary-rosePink" />
                    <span className="font-bold text-lg">{video.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'products' && (
          productLikes.length === 0 ? (
            <div className="glass-morphism rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-display text-secondary-dark mb-2">
                No Product Likes Yet
              </h3>
              <p className="text-secondary-dark/60">
                Products will appear here once they receive likes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {productLikes.map((product) => (
                <div key={product._id} className="card-premium p-4 flex items-center gap-4">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/60'}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-secondary-dark truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-secondary-dark/60">
                      ₹{product.price?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaThumbsUp className="text-primary-rosePink" />
                    <span className="font-bold text-lg">{product.wishlistCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Likes;