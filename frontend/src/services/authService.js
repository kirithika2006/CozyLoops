import api from './api';

export const authService = {
  requestOwnerOtp: async (email) => {
    const response = await api.post('/admin/owner/request-otp', { email });
    return response.data;
  },

  verifyOwnerOtp: async (email, otp) => {
    const response = await api.post('/admin/owner/verify-otp', { email, otp });
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
