import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | CozyLoops</title>
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          <div className="relative inline-block mb-8">
            <div className="text-9xl font-display font-bold text-gradient">
              404
            </div>
            <div className="absolute -top-4 -right-8 text-6xl animate-float">
              🧶
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-secondary-dark mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-secondary-dark/60 mb-8">
            Looks like this page got lost in the yarn! Don't worry, we'll help you find your way back.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <FaHome className="mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <FaSearch className="mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-sm text-secondary-dark/40">
              Looking for something specific? Try our search bar above.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;