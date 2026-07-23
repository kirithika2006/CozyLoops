import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../product/ProductCard';
import SkeletonLoader from '../common/SkeletonLoader';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getTrendingProducts(8);
        setProducts(response.products || []);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Trending Products</h2>
          <SkeletonLoader type="product" count={4} />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Trending Products</h2>
          <div className="glass-morphism rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-2xl font-display text-secondary-dark mb-2">
              No Trending Products Yet
            </h3>
            <p className="text-secondary-dark/60">
              Check back soon for the latest trending crochet creations!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="section-title">Trending Products</h2>
              <p className="text-secondary-dark/60 mt-2">What's hot right now</p>
            </div>
            <span className="text-sm bg-primary-babyPink/20 px-4 py-2 rounded-full">
              🔥 Trending
            </span>
          </div>
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

export default TrendingProducts;