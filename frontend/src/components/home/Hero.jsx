import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Button from '../common/Button';

const Hero = () => {
  const quotes = [
    '"Made with yarn, stitched with love."',
    '"Every stitch tells a story."',
    '"Handmade happiness delivered to your doorstep."',
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-primary-lightPink/30 via-white to-primary-babyPink/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #FFB6C1 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-primary-babyPink/20 rounded-full"
            >
              <span className="text-primary-darkPink font-semibold text-sm">Handmade with Love</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-secondary-dark">Welcome to </span>
              <span className="text-primary-darkPink">cozy.loopsss_</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-lg text-lg font-medium leading-8 text-secondary-dark"
            >
              Handmade crochet creations crafted with care. We offer custom crochet flowers, 
              bouquets, keychains, phone charms, plushies and personalized gifts. Each piece 
              is handmade with attention to detail, making every order unique and special.
            </motion.p>

            {/* Quotes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              {quotes.map((quote, index) => (
                <motion.p
                  key={index}
                  className="text-primary-rosePink font-cursive text-lg md:text-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                >
                  {quote}
                </motion.p>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/shop">
                <Button variant="primary" size="lg" className="group">
                  Shop Now
                  <FaArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-8 pt-4"
            >
              <div>
                <p className="font-display text-2xl font-bold text-secondary-dark">100+</p>
                <p className="text-sm text-secondary-dark/60">Happy Customers</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-secondary-dark">50+</p>
                <p className="text-sm text-secondary-dark/60">Unique Products</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-secondary-dark">4.9â­</p>
                <p className="text-sm text-secondary-dark/60">Average Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Main Image Placeholder - Crochet Theme */}
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-premium bg-gradient-to-br from-primary-babyPink/30 to-primary-rosePink/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <img
                      src="/cozyloops-trademark.png"
                      alt="cozy.loopsss_ trademark logo with crochet flowers, yarn, and needles"
                      className="mx-auto w-[82%] max-w-[420px] animate-float object-contain"
                    />
                    <p className="font-cursive text-2xl text-primary-rosePink">Handmade with Love</p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-primary-babyPink/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-primary-rosePink/10 rounded-full blur-3xl animate-pulse" />
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

