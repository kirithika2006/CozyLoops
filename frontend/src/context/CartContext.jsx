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
    const madeToOrder = product.fulfillmentType === 'MADE_TO_ORDER';
    if (!product.isAvailable || (!madeToOrder && Number(product.stock) < 1)) {
      toast.error('This product is currently unavailable');
      return;
    }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      const nextQuantity = (existingItem?.quantity || 0) + quantity;
      if (!madeToOrder && nextQuantity > Number(product.stock)) {
        toast.error(`Only ${product.stock} unit(s) are available`);
        return prevItems;
      }
      
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
          sku: product.sku,
          fulfillmentType: product.fulfillmentType || 'READY_TO_SHIP',
          preparationTime: product.preparationTime || '',
          isAvailable: product.isAvailable !== false,
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

    const item = cartItems.find(cartItem => cartItem._id === productId);
    if (quantity > 100 || (item?.fulfillmentType !== 'MADE_TO_ORDER' && item && quantity > Number(item.stock))) {
      toast.error(item?.fulfillmentType === 'MADE_TO_ORDER' ? 'Maximum quantity is 100 per item' : `Only ${item?.stock || 0} unit(s) are available`);
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

  const removePurchasedItems = (purchasedItems) => {
    const quantities = new Map(purchasedItems.map(item => [String(item._id || item.productId), item.quantity]));
    setCartItems(prev => prev.flatMap(item => {
      const remaining = item.quantity - (quantities.get(String(item._id)) || 0);
      return remaining > 0 ? [{ ...item, quantity: remaining }] : [];
    }));
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
    removePurchasedItems,
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
