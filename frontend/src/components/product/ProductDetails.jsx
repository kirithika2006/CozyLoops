import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaShare, FaCopy, FaCheck } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const {
    _id,
    name,
    description,
    price,
    discount,
    stock,
    sku,
    material,
    weight,
    dimensions,
    colorsAvailable,
    sizesAvailable,
    estimatedDelivery,
    careInstructions,
    customizable,
    tags,
    averageRating,
    totalReviews,
    isAvailable,
    category
  } = product;

  const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
  const isWishlisted = isInWishlist(_id);
  const savings = discount > 0 ? price - discountedPrice : 0;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (stock === 0) {
      toast.error('Out of stock');
      return;
    }
    addToCart({ ...product, quantity });
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    if (stock === 0) {
      toast.error('Out of stock');
      return;
    }
    // Add to cart first, then navigate to contact
    addToCart({ ...product, quantity });
    setTimeout(() => {
      window.location.href = '/contact';
    }, 500);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${_id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name} on CozyLoops!`,
          url: url,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share error:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        toast.success('Product link copied!');
        setTimeout(() => setIsCopied(false), 3000);
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary-dark">
          {name}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
              const rating = averageRating || 0;
              if (index < Math.floor(rating)) {
                return <FaStar key={index} className="text-yellow-400 text-sm" />;
              } else if (index < Math.ceil(rating) && rating % 1 !== 0) {
                return <FaStarHalfAlt key={index} className="text-yellow-400 text-sm" />;
              } else {
                return <FaStar key={index} className="text-gray-300 text-sm" />;
              }
            })}
          </div>
          <span className="text-sm text-secondary-dark/60">
            ({totalReviews || 0} reviews)
          </span>
          {category && (
            <span className="text-sm text-primary-rosePink bg-primary-babyPink/20 px-3 py-1 rounded-full">
              {category.name}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-primary-rosePink">
          ₹{discountedPrice.toFixed(2)}
        </span>
        {discount > 0 && (
          <>
            <span className="text-xl text-secondary-dark/60 line-through">
              ₹{price.toFixed(2)}
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
              Save ₹{savings.toFixed(2)}
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {stock > 0 ? '✓ In Stock' : '✕ Out of Stock'}
        </span>
        {stock > 0 && stock < 10 && (
          <span className="text-xs text-orange-500">(Only {stock} left!)</span>
        )}
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-secondary-dark mb-2">Description</h3>
        <p className="text-secondary-dark/70 leading-relaxed">{description}</p>
      </div>

      {/* Customizable */}
      {customizable && (
        <div className="bg-primary-lightPink/30 rounded-xl p-4">
          <p className="text-sm text-secondary-dark">
            🎨 This product is customizable! Contact us for personalized orders.
          </p>
        </div>
      )}

      {/* Colors */}
      {colorsAvailable && colorsAvailable.length > 0 && (
        <div>
          <h3 className="font-semibold text-secondary-dark mb-2">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colorsAvailable.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedColor === color
                    ? 'bg-primary-rosePink text-white shadow-soft'
                    : 'bg-gray-100 text-secondary-dark hover:bg-gray-200'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizesAvailable && sizesAvailable.length > 0 && (
        <div>
          <h3 className="font-semibold text-secondary-dark mb-2">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {sizesAvailable.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedSize === size
                    ? 'bg-primary-rosePink text-white shadow-soft'
                    : 'bg-gray-100 text-secondary-dark hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-semibold text-secondary-dark mb-2">Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="px-4 py-2 hover:bg-primary-babyPink/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= stock}
              className="px-4 py-2 hover:bg-primary-babyPink/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <span className="text-sm text-secondary-dark/60">
            {stock} available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={!isAvailable || stock === 0}
          className="flex-1 min-w-[200px]"
        >
          <FaShoppingCart className="mr-2" />
          Add to Cart
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={handleBuyNow}
          disabled={!isAvailable || stock === 0}
          className="flex-1 min-w-[200px]"
        >
          Buy Now
        </Button>
        <button
          onClick={() => toggleWishlist(product)}
          className="p-4 border-2 border-primary-rosePink rounded-full hover:bg-primary-rosePink hover:text-white transition-all duration-300"
        >
          <FaHeart className={isWishlisted ? 'text-primary-rosePink' : ''} />
        </button>
        <button
          onClick={handleShare}
          className="p-4 border-2 border-gray-200 rounded-full hover:border-primary-rosePink transition-all duration-300"
        >
          {isCopied ? <FaCheck className="text-green-500" /> : <FaShare />}
        </button>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-secondary-dark/60">SKU</p>
          <p className="font-medium text-secondary-dark">{sku}</p>
        </div>
        <div>
          <p className="text-sm text-secondary-dark/60">Material</p>
          <p className="font-medium text-secondary-dark">{material}</p>
        </div>
        <div>
          <p className="text-sm text-secondary-dark/60">Weight</p>
          <p className="font-medium text-secondary-dark">{weight}g</p>
        </div>
        {dimensions && (
          <div>
            <p className="text-sm text-secondary-dark/60">Dimensions</p>
            <p className="font-medium text-secondary-dark">
              {dimensions.length}×{dimensions.width}×{dimensions.height} {dimensions.unit || 'cm'}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-secondary-dark/60">Estimated Delivery</p>
          <p className="font-medium text-secondary-dark">{estimatedDelivery || '3-5 business days'}</p>
        </div>
        {careInstructions && (
          <div>
            <p className="text-sm text-secondary-dark/60">Care Instructions</p>
            <p className="font-medium text-secondary-dark">{careInstructions}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;