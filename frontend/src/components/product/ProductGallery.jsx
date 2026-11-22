import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa';

const ProductGallery = ({ images = [], name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(null);
  const lightboxRef = useRef(null);
  const closeButtonRef = useRef(null);
  const galleryImages = Array.isArray(images) ? images : [];

  const nextImage = () => setCurrentIndex(index => (index + 1) % galleryImages.length);
  const prevImage = () => setCurrentIndex(index => (index - 1 + galleryImages.length) % galleryImages.length);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    document.body.style.overflow = 'hidden';
    const handleKeyDown = event => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
      if (galleryImages.length > 1 && event.key === 'ArrowRight') nextImage();
      if (galleryImages.length > 1 && event.key === 'ArrowLeft') prevImage();
      if (event.key === 'Tab') {
        const controls = lightboxRef.current?.querySelectorAll('button:not(:disabled)');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [isLightboxOpen, galleryImages.length]);

  if (!galleryImages.length) {
    return <div className="aspect-square rounded-2xl bg-secondary-gray flex items-center justify-center text-secondary-dark/60">No Image Available</div>;
  }

  const handleTouchEnd = event => {
    if (touchStartX.current === null || galleryImages.length < 2) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 45) (delta < 0 ? nextImage : prevImage)();
    touchStartX.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-secondary-gray bg-secondary-light p-3">
        <img
          src={galleryImages[currentIndex]?.url || ''}
          alt={`${name} — image ${currentIndex + 1}`}
          className="h-full w-full rounded-xl object-contain"
          onClick={() => setIsLightboxOpen(true)}
        />

        {galleryImages.length > 1 && <>
          <button type="button" onClick={prevImage} aria-label="Previous product image" className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-secondary-dark shadow-soft hover:text-primary-darkPink">
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={nextImage} aria-label="Next product image" className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-secondary-dark shadow-soft hover:text-primary-darkPink">
            <FaChevronRight aria-hidden="true" />
          </button>
        </>}

        <button type="button" onClick={() => setIsLightboxOpen(true)} aria-label="View product image fullscreen" className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-secondary-dark shadow-soft hover:text-primary-darkPink">
          <FaExpand aria-hidden="true" />
        </button>

        {galleryImages.length > 1 && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-secondary-dark/80 px-3 py-1 text-xs text-white" aria-live="polite">
          {currentIndex + 1} / {galleryImages.length}
        </div>}
      </div>

      {galleryImages.length > 1 && <div className="flex gap-2 overflow-x-auto pb-2">
        {galleryImages.map((image, index) => <button
          key={`${image.url}-${index}`}
          type="button"
          onClick={() => setCurrentIndex(index)}
          aria-label={`Show product image ${index + 1}`}
          aria-current={index === currentIndex ? 'true' : undefined}
          className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-secondary-light p-1 ${index === currentIndex ? 'border-primary-rosePink' : 'border-transparent hover:border-primary-babyPink'}`}
        >
          <img src={image.url} alt="" className="h-full w-full rounded-lg object-contain" loading="lazy" />
        </button>)}
      </div>}

      <AnimatePresence>
        {isLightboxOpen && <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} product images`}
          ref={lightboxRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={event => { touchStartX.current = event.touches[0].clientX; }}
          onTouchEnd={handleTouchEnd}
        >
          <button ref={closeButtonRef} type="button" onClick={() => setIsLightboxOpen(false)} aria-label="Close fullscreen image" className="absolute right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-secondary-dark shadow-lg hover:bg-primary-lightPink">
            <FaTimes aria-hidden="true" />
          </button>
          <img
            src={galleryImages[currentIndex]?.url || ''}
            alt={`${name} — image ${currentIndex + 1}`}
            className="max-h-[calc(100vh-2rem)] max-w-full select-none object-contain sm:max-h-[calc(100vh-3rem)]"
            draggable="false"
            onClick={event => event.stopPropagation()}
          />
          {galleryImages.length > 1 && <>
            <button type="button" onClick={event => { event.stopPropagation(); prevImage(); }} aria-label="Previous product image" className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-secondary-dark shadow-lg sm:left-6">
              <FaChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={event => { event.stopPropagation(); nextImage(); }} aria-label="Next product image" className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-secondary-dark shadow-lg sm:right-6">
              <FaChevronRight aria-hidden="true" />
            </button>
          </>}
        </motion.div>}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;
