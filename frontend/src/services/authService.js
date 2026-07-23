import api from './api';

export const authService = {
  // Admin login
  login: async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/admin/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Get admin profile
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('cozyloops_admin_token');
    localStorage.removeItem('cozyloops_admin_user');
  },

  // Check if admin is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem('cozyloops_admin_token');
    const user = localStorage.getItem('cozyloops_admin_user');
    return !!(token && user);
  },
};