import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaTimes, FaVideo, FaImage,
  FaPlay, FaHeart, FaComment, FaShare, FaCamera, FaUpload
} from 'react-icons/fa';
import { videoService } from '../../services/videoService';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    hashtags: []
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await videoService.getVideos({ limit: 50 });
      setVideos(response.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (video = null) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title || '',
        description: video.description || '',
        category: video.category || 'General',
        hashtags: video.hashtags || []
      });
      setVideoPreview(video.videoUrl || '');
      setThumbnailPreview(video.thumbnail || '');
      setVideoFile(null);
      setThumbnailFile(null);
    } else {
      setEditingVideo(null);
      setFormData({
        title: '',
        description: '',
        category: 'General',
        hashtags: []
      });
      setVideoPreview('');
      setThumbnailPreview('');
      setVideoFile(null);
      setThumbnailFile(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreview('');
    setThumbnailPreview('');
    setTagInput('');
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check duration (3 minutes max)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 180) {
          toast.error('Video duration exceeds 3 minutes limit');
          e.target.value = '';
          return;
        }
        setVideoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // FIX: These functions were missing
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.hashtags.includes(trimmedTag)) {
      setFormData({ 
        ...formData, 
        hashtags: [...formData.hashtags, trimmedTag] 
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ 
      ...formData, 
      hashtags: formData.hashtags.filter(t => t !== tag) 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Video title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Video description is required');
      return;
    }
    
    // For new videos, video and thumbnail are required
    if (!editingVideo) {
      if (!videoFile) {
        toast.error('Please select a video file');
        return;
      }
      if (!thumbnailFile) {
        toast.error('Please select a thumbnail image');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Append form fields
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('category', formData.category);
      
      // Ensure hashtags is always a stringified array
      const hashtagsArray = Array.isArray(formData.hashtags) ? formData.hashtags : [];
      submitData.append('hashtags', JSON.stringify(hashtagsArray));
      
      // Append video file (only for new videos)
      if (videoFile) {
        submitData.append('video', videoFile);
      }
      
      // Append thumbnail file (for new videos or thumbnail updates)
      if (thumbnailFile) {
        submitData.append('thumbnail', thumbnailFile);
      }

      console.log('📤 Sending video data...');
      for (let [key, value] of submitData.entries()) {
        if (key !== 'video' && key !== 'thumbnail') {
          console.log(`${key}: ${value}`);
        } else {
          console.log(`${key}: File uploaded`);
        }
      }

      let response;
      if (editingVideo) {
        response = await videoService.updateVideo(editingVideo._id, submitData);
        toast.success('Video updated successfully! ✅');
      } else {
        response = await videoService.uploadVideo(submitData);
        toast.success('Video uploaded successfully! ✅');
      }

      // Refresh video list
      await fetchVideos();
      handleCloseModal();
    } catch (error) {
      console.error('❌ Error saving video:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.data && error.response.data.errors) {
          if (Array.isArray(error.response.data.errors)) {
            error.response.data.errors.forEach(err => toast.error(err));
          } else if (typeof error.response.data.errors === 'object') {
            Object.values(error.response.data.errors).forEach(err => toast.error(err));
          }
        } else if (error.response.data && error.response.data.message) {
          toast.error(`❌ ${error.response.data.message}`);
        } else {
          toast.error('❌ Failed to save video. Please check all fields.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('❌ No response from server. Is the backend running?');
      } else {
        console.error('Error:', error.message);
        toast.error(`❌ ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await videoService.deleteVideo(id);
      toast.success('Video deleted successfully');
      await fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error(error.response?.data?.message || 'Failed to delete video');
    }
  };

  const categories = [
    'General',
    'Tutorial',
    'Behind the Scenes',
    'Product Showcase',
    'Customer Creations',
    'Tips & Tricks'
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-secondary-dark">
            Videos
          </h2>
          <p className="text-secondary-dark/60">Manage your video content</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" />
          Upload Video
        </Button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <motion.div
            key={video._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-premium overflow-hidden group"
          >
            <div className="relative aspect-video overflow-hidden bg-primary-lightPink/20">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                  <FaPlay className="text-primary-rosePink text-xl ml-1" />
                </div>
              </div>
              {video.duration > 0 && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-secondary-dark line-clamp-1">
                {video.title}
              </h3>
              <p className="text-sm text-secondary-dark/60 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm text-secondary-dark/60">
                <span className="flex items-center gap-1">
                  <FaHeart /> {video.likes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FaComment /> {video.comments || 0}
                </span>
                <span className="text-xs">
                  {new Date(video.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(video)}
                  className="p-2 text-secondary-dark/60 hover:text-primary-rosePink transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="p-2 text-secondary-dark/60 hover:text-red-500 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="glass-morphism rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-2xl font-display text-secondary-dark mb-2">
            No Videos Yet
          </h3>
          <p className="text-secondary-dark/60">
            Upload your first video to showcase your crochet creations
          </p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-premium max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-xl font-bold text-secondary-dark">
                  {editingVideo ? 'Edit Video' : 'Upload Video'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-primary-babyPink/20 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea-field"
                    rows="3"
                    placeholder="Describe your video..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="select-field"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Video Upload */}
                {!editingVideo && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Video File (Max 3 minutes) *
                    </label>
                    <div className="border-2 border-dashed border-primary-babyPink/30 rounded-xl p-4 text-center hover:border-primary-rosePink transition-colors">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        id="video-upload"
                        required={!editingVideo}
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <FaVideo className="text-3xl text-secondary-dark/40 mx-auto mb-2" />
                        <p className="text-sm text-secondary-dark/60">
                          {videoFile ? videoFile.name : 'Click to upload video'}
                        </p>
                        <p className="text-xs text-secondary-dark/40 mt-1">
                          MP4, WebM, MOV (Max 50MB, 3 minutes)
                        </p>
                      </label>
                    </div>
                    {videoPreview && (
                      <video
                        ref={videoRef}
                        src={videoPreview}
                        controls
                        className="w-full mt-2 rounded-xl max-h-64"
                      />
                    )}
                  </div>
                )}

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Thumbnail *
                  </label>
                  <div className="border-2 border-dashed border-primary-babyPink/30 rounded-xl p-4 text-center hover:border-primary-rosePink transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                      required={!editingVideo && !thumbnailFile}
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      <FaImage className="text-3xl text-secondary-dark/40 mx-auto mb-2" />
                      <p className="text-sm text-secondary-dark/60">
                        {thumbnailFile ? thumbnailFile.name : 'Click to upload thumbnail'}
                      </p>
                    </label>
                  </div>
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded-xl mt-2"
                    />
                  )}
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Hashtags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="input-field flex-1"
                      placeholder="Add hashtag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-primary-babyPink/20 rounded-xl hover:bg-primary-babyPink/30 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-primary-babyPink/20 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-secondary-dark/40 hover:text-red-500"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {editingVideo ? 'Update Video' : 'Upload Video'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Videos;