import React from 'react';
import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  custom: (message, options = {}) => toast(message, options),
};

// Toast component with custom styling
export const Toast = ({ message, type = 'info' }) => {
  const getStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-primary-babyPink/20 border-primary-babyPink/30 text-secondary-dark';
    }
  };

  return (
    <div className={`${getStyle()} border rounded-xl p-4 shadow-glass backdrop-blur-glass`}>
      {message}
    </div>
  );
};

export default Toast;