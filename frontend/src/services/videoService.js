import api from './api';

export const videoService = {
  // Get all videos
  getVideos: async (params = {}) => {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  // Get single video
  getVideo: async (id) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  // Upload video (admin only)
  uploadVideo: async (formData) => {
    const response = await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update video (admin only)
  updateVideo: async (id, formData) => {
    const response = await api.put(`/videos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete video (admin only)
  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },

  // Like/unlike video
  toggleLike: async (id, identifier) => {
    const response = await api.post(`/videos/${id}/like`, { identifier });
    return response.data;
  },

  // Get video likes
  getLikes: async (id) => {
    const response = await api.get(`/videos/${id}/likes`);
    return response.data;
  },
};