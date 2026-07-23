import api from './api';

export const commentService = {
  // Add comment
  addComment: async (data) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  // Get comments
  getComments: async (params = {}) => {
    const response = await api.get('/comments', { params });
    return response.data;
  },

  // Delete comment (admin only)
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};