import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { productService } from '../../services/productService';
import ProductCard from '../product/ProductCard';
import SkeletonLoader from '../common/SkeletonLoader';
import Button from '../common/Button';

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchLatestProducts = async () => {
      try {
        const response = await productService.getLatestProducts(8);
        if (active) setProducts(response.products || []);
      } catch (error) {
        console.error('Error fetching latest products:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLatestProducts();
    // Refresh newest admin-created products while the home page is open.
    const refreshTimer = window.setInterval(fetchLatestProducts, 60000);
    const refreshOnReturn = () => {
      if (document.visibilityState === 'visible') fetchLatestProducts();
    };
    document.addEventListener('visibilitychange', refreshOnReturn);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      document.removeEventListener('visibilitychange', refreshOnReturn);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-primary-lightPink/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Latest Arrivals</h2>
          <SkeletonLoader type="product" count={4} />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-primary-lightPink/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Latest Arrivals</h2>
          <div className="glass-morphism rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">🆕</div>
            <h3 className="text-2xl font-display text-secondary-dark mb-2">
              No New Products Yet
            </h3>
            <p className="text-secondary-dark/60">
              Admin has not added new products yet. Stay tuned for exciting new arrivals!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary-lightPink/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="section-title">Latest Arrivals</h2>
            <p className="text-secondary-dark/60 mt-2">Fresh from the hook</p>
          </div>
          <Link to="/shop?sort=-createdAt">
            <Button variant="ghost" className="flex items-center space-x-2">
              <span>View All</span>
              <FaArrowRight className="text-sm" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
