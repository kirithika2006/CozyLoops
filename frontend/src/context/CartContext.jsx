import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cozyloops_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
        updateTotals(parsed);
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cozyloops_cart');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cozyloops_cart', JSON.stringify(cartItems));
        updateTotals(cartItems);
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems]);

  const updateTotals = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.discount > 0 ? 
        item.price - (item.price * item.discount / 100) : 
        item.price;
      return sum + (price * item.quantity);
    }, 0);
    setCartTotal(total);
    setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItems = prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item - store ONLY the product data needed for cart
        const cartItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          images: product.images || [],
          stock: product.stock,
          material: product.material,
          quantity: quantity
        };
        toast.success(`${product.name} added to cart`);
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item._id === productId);
      const updatedItems = prevItems.filter(item => item._id !== productId);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart`);
      }
      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getItemCount = () => cartCount;

  const getTotalPrice = () => cartTotal;

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  // All functions are defined and exported
  const value = {
    cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    isInCart,
    isLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};