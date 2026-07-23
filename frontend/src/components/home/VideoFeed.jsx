import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaHeart, FaComment, FaShare, FaTimes } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { videoService } from '../../services/videoService';
import SkeletonLoader from '../common/SkeletonLoader';
import toast from 'react-hot-toast';

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [likedVideos, setLikedVideos] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await videoService.getVideos({ limit: 6 });
        setVideos(response.videos || []);
        
        // Load liked status from localStorage
        const savedLikes = localStorage.getItem('cozyloops_video_likes');
        if (savedLikes) {
          setLikedVideos(JSON.parse(savedLikes));
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleLike = async (videoId) => {
    const identifier = localStorage.getItem('cozyloops_visitor_id') || 
      `visitor_${Date.now()}`;
    
    if (!localStorage.getItem('cozyloops_visitor_id')) {
      localStorage.setItem('cozyloops_visitor_id', identifier);
    }

    try {
      const response = await videoService.toggleLike(videoId, identifier);
      
      // Update local state
      setVideos(prev => prev.map(v => 
        v._id === videoId ? { ...v, likes: response.likes } : v
      ));

      // Update liked status
      const newLikedStatus = { ...likedVideos };
      if (response.liked) {
        newLikedStatus[videoId] = true;
      } else {
        delete newLikedStatus[videoId];
      }
      setLikedVideos(newLikedStatus);
      localStorage.setItem('cozyloops_video_likes', JSON.stringify(newLikedStatus));
      
      toast.success(response.liked ? 'Liked! 💕' : 'Unliked');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleShare = (video) => {
    const url = `${window.location.origin}/video/${video._id}`;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Video link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Video Feed</h2>
          <SkeletonLoader type="video" count={3} />
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Video Feed</h2>
          <div className="glass-morphism rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-2xl font-display text-secondary-dark mb-2">
              No Videos Yet
            </h3>
            <p className="text-secondary-dark/60">
              Admin has not uploaded any videos yet. Check back soon for crochet tutorials and showcases!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="section-title">Video Feed</h2>
          <p className="text-secondary-dark/60 mt-2">Watch our crochet creations in action</p>
        </motion.div>

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="break-inside-avoid"
            >
              <div className="card-premium overflow-hidden group cursor-pointer">
                {/* Video Thumbnail */}
                <div 
                  className="relative overflow-hidden aspect-video"
                  onClick={() => setSelectedVideo(video)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <FaPlay className="text-primary-rosePink text-2xl ml-1" />
                    </div>
                  </div>
                  {video.duration > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-secondary-dark mb-1 line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-secondary-dark/60 line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  
                  {/* Tags */}
                  {video.hashtags && video.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {video.hashtags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs text-primary-rosePink">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(video._id)}
                        className="flex items-center space-x-1 text-sm text-secondary-dark/60 hover:text-primary-rosePink transition-colors"
                      >
                        <FaHeart className={likedVideos[video._id] ? 'text-primary-rosePink' : ''} />
                        <span>{video.likes || 0}</span>
                      </button>
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="flex items-center space-x-1 text-sm text-secondary-dark/60 hover:text-primary-rosePink transition-colors"
                      >
                        <FaComment />
                        <span>{video.comments || 0}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleShare(video)}
                      className="text-sm text-secondary-dark/60 hover:text-primary-rosePink transition-colors"
                    >
                      <FaShare />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <FaTimes />
            </button>

            <div className="aspect-video">
              <ReactPlayer
                url={selectedVideo.videoUrl}
                controls
                width="100%"
                height="100%"
                playing
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                    },
                  },
                }}
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-display text-secondary-dark mb-2">
                {selectedVideo.title}
              </h3>
              <p className="text-secondary-dark/60 mb-4">
                {selectedVideo.description}
              </p>
              {selectedVideo.hashtags && selectedVideo.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.hashtags.map((tag, i) => (
                    <span key={i} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default VideoFeed;