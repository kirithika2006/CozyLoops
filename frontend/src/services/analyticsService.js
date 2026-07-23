import api from './api';

export const analyticsService = {
  // Get analytics data
  getAnalytics: async () => {
    try {
      const response = await api.get('/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Return default data on error
      return {
        success: true,
        analytics: {
          totalProducts: 0,
          totalVideos: 0,
          totalCategories: 0,
          totalComments: 0,
          totalLikes: 0,
          totalWishlist: 0,
          latestUploads: { products: [], videos: [] },
          dailyStats: [],
          updatedAt: new Date()
        }
      };
    }
  },

  // Get daily stats
  getDailyStats: async (days = 7) => {
    try {
      const response = await api.get('/analytics/daily', { params: { days } });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      return { success: true, stats: [] };
    }
  },

  // Track view
  trackView: async (type, id) => {
    try {
      const response = await api.post('/analytics/view', { type, id });
      return response.data;
    } catch (error) {
      console.error('Error tracking view:', error);
      return { success: false };
    }
  },
};