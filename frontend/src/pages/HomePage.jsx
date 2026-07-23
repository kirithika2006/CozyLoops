import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TrendingProducts from '../components/home/TrendingProducts';
import LatestProducts from '../components/home/LatestProducts';
import VideoFeed from '../components/home/VideoFeed';
import CustomerReviews from '../components/home/CustomerReviews';
import Categories from '../components/home/Categories';
import About from '../components/home/About';
import FAQ from '../components/home/FAQ';
// Remove this import: import Newsletter from '../components/home/Newsletter';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>CozyLoops - Handmade Crochet Creations</title>
        <meta 
          name="description" 
          content="Handmade crochet creations crafted with care. Custom crochet flowers, bouquets, keychains, phone charms, plushies and personalized gifts." 
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <Hero />
        <FeaturedProducts />
        <TrendingProducts />
        <LatestProducts />
        <VideoFeed />
        <Categories />
        <About />
        <CustomerReviews />
        <FAQ />
        {/* Remove this line: <Newsletter /> */}
      </motion.div>
    </>
  );
};

export default HomePage;