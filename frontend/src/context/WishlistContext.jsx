import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('cozyloops_wishlist');
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        setWishlistItems(parsed);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        localStorage.removeItem('cozyloops_wishlist');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cozyloops_wishlist', JSON.stringify(wishlistItems));
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
      }
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item._id === product._id);
      if (exists) {
        toast('Product already in wishlist', { icon: '💕' });
        return prevItems;
      }
      // Store only what's needed for wishlist display
      const wishlistItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount || 0,
        images: product.images || [],
        description: product.description,
        stock: product.stock,
        material: product.material,
        isFeatured: product.isFeatured,
        isTrending: product.isTrending,
        isNewArrival: product.isNewArrival,
        averageRating: product.averageRating,
        totalReviews: product.totalReviews
      };
      toast.success(`${product.name} added to wishlist 💕`);
      return [...prevItems, wishlistItem];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => {
      const itemToRemove = prevItems.find(item => item._id === productId);
      const updatedItems = prevItems.filter(item => item._id !== productId);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from wishlist`);
      }
      return updatedItems;
    });
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const getWishlistCount = () => wishlistItems.length;

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success('Wishlist cleared');
  };

  // All functions are defined and exported
  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    isLoaded
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};