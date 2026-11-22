import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  disabled = false,
  type = 'button',
  isLoading = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-pink text-white hover:shadow-premium',
    secondary: 'bg-white text-primary-rosePink border-2 border-primary-rosePink hover:bg-primary-rosePink hover:text-white',
    ghost: 'hover:bg-primary-babyPink/20 text-secondary-dark',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'min-h-10 px-4 py-2 text-sm',
    md: 'min-h-12 px-6 py-3 text-base',
    lg: 'min-h-14 px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`inline-flex items-center justify-center gap-2 text-center leading-tight ${variants[variant]} ${sizes[size]} rounded-full font-semibold transition-all duration-300 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
