import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../product/ProductCard';
import SkeletonLoader from '../common/SkeletonLoader';
import Button from '../common/Button';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getFeaturedProducts(8);
        setProducts(response.products || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Featured Products</h2>
          </div>
          <SkeletonLoader type="product" count={4} />
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Featured Products</h2>
          </div>
          <div className="glass-morphism rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">🧶</div>
            <h3 className="text-2xl font-display text-secondary-dark mb-2">
              No Featured Products Yet
            </h3>
            <p className="text-secondary-dark/60">
              Admin has not added featured products yet. Stay tuned for beautiful handmade crochet creations!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary-lightPink/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="text-secondary-dark/60 mt-2">Handpicked just for you</p>
          </div>
          <Link to="/shop">
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

export default FeaturedProducts;