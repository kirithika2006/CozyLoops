import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import { Helmet } from 'react-helmet-async';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/contact');
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - CozyLoops</title>
        </Helmet>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="font-display text-3xl font-bold text-secondary-dark mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-secondary-dark/60 mb-8">
              Looks like you haven't added any items to your cart yet. 
              Explore our collection and find something you love!
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - CozyLoops</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <h1 className="font-display text-3xl font-bold text-secondary-dark mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => {
                const discountedPrice = item.discount > 0 
                  ? item.price - (item.price * item.discount / 100)
                  : item.price;
                const totalPrice = discountedPrice * item.quantity;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="card-premium p-4 flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-primary-lightPink/20">
                      <img
                        src={item.images?.[0]?.url || 'https://via.placeholder.com/100'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item._id}`}>
                        <h3 className="font-semibold text-secondary-dark hover:text-primary-rosePink transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-secondary-dark/60 line-clamp-1">
                        {item.material}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-primary-rosePink">
                          ₹{discountedPrice.toFixed(2)}
                        </span>
                        {item.discount > 0 && (
                          <span className="text-xs text-secondary-dark/60 line-through">
                            ₹{item.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-primary-babyPink/20 transition-colors"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="px-3 py-1 min-w-[2rem] text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-primary-babyPink/20 transition-colors"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-secondary-dark/40 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-secondary-dark">
                        ₹{totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="card-premium p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-secondary-dark mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-dark/60">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-dark/60">Shipping</span>
                  <span className="font-medium text-green-500">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold py-4">
                <span>Total</span>
                <span className="text-primary-rosePink">₹{cartTotal.toFixed(2)}</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <FaArrowRight className="ml-2" />
              </Button>

              <Link
                to="/shop"
                className="block text-center text-sm text-secondary-dark/60 hover:text-primary-rosePink transition-colors mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CartPage;