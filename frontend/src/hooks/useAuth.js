import { useAdmin } from '../context/AdminContext';

export const useAuth = () => {
  const { isAdmin, adminUser, isLoading, login, logout, changePassword } = useAdmin();
  
  return {
    isAdmin,
    adminUser,
    isLoading,
    login,
    logout,
    changePassword
  };
};