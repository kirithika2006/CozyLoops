import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/admin/login', { username, password });
      
      if (response.data.success) {
        const { token, admin } = response.data;
        
        // Store in localStorage
        localStorage.setItem('cozyloops_admin_token', token);
        localStorage.setItem('cozyloops_admin_user', JSON.stringify(admin));
        
        setToken(token);
        setAdminUser(admin);
        setIsAdmin(true);
        
        toast.success('Welcome back, Admin!');
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid username or password';
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
      const response = await axios.put('/api/admin/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
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