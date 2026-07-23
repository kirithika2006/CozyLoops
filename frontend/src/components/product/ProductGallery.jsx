import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import ImageZoom from "react-medium-image-zoom";

const ProductGallery = ({ images, name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">No Image Available</span>
      </div>
    );
  }

  const zoomProps = {
    width: 500,
    height: 500,
    img: images[currentIndex]?.url || '',
    zoomWidth: 400,
    zoomPosition: 'right',
    offset: { vertical: 0, horizontal: 10 },
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border-2 border-primary-babyPink/20">
        {isZoomed ? (
          <div className="w-full h-full">
            <ImageZoom {...zoomProps} />
          </div>
        ) : (
          <img
            src={images[currentIndex]?.url || ''}
            alt={`${name} - ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        )}

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft hover:shadow-premium transition-all duration-300 hover:scale-110"
            >
              <FaChevronLeft className="text-secondary-dark" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft hover:shadow-premium transition-all duration-300 hover:scale-110"
            >
              <FaChevronRight className="text-secondary-dark" />
            </button>
          </>
        )}

        {/* Zoom Toggle */}
        <button
          onClick={handleZoomToggle}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft hover:shadow-premium transition-all duration-300"
        >
          <FaExpand className="text-secondary-dark" />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-primary-rosePink shadow-soft'
                  : 'border-transparent hover:border-primary-babyPink/50'
              }`}
            >
              <img
                src={image.url}
                alt={`${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;