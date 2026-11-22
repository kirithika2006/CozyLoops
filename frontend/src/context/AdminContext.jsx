import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminSession = () => {
      const storedToken = localStorage.getItem('cozyloops_admin_token');
      const storedAdmin = localStorage.getItem('cozyloops_admin_user');
      
      if (storedToken && storedAdmin) {
        try {
          setToken(storedToken);
          setAdminUser(JSON.parse(storedAdmin));
          setIsAdmin(true);
        } catch (error) {
          console.error('Error parsing admin data:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAdminSession();
  }, []);

  const login = async (email, otp) => {
    try {
      const { token, admin, success } = await authService.verifyOwnerOtp(email, otp);

      if (success) {
        
        // Store in localStorage
        localStorage.setItem('cozyloops_admin_token', token);
        localStorage.setItem('cozyloops_admin_user', JSON.stringify(admin));
        
        setToken(token);
        setAdminUser(admin);
        setIsAdmin(true);
        
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Could not verify the code. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('cozyloops_admin_token');
    localStorage.removeItem('cozyloops_admin_user');
    setToken(null);
    setAdminUser(null);
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);

      if (response.success) {
        toast.success('Password changed successfully');
        return { success: true };
      }
    } catch (error) {
      console.error('Password change error:', error);
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return { success: false, message };
    }
  };

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const value = {
    isAdmin,
    adminUser,
    isLoading,
    token,
    login,
    logout,
    changePassword,
    getAuthHeaders,
    isAuthenticated: isAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
