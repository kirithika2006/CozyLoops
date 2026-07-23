import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import ProductCard from './ProductCard';
import SkeletonLoader from '../common/SkeletonLoader';

const RelatedProducts = ({ productId, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          category: categoryId,
          limit: 4,
          exclude: productId
        });
        setProducts(response.products || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, productId]);

  if (loading) {
    return (
      <div className="mt-16">
        <h3 className="font-display text-2xl font-bold text-secondary-dark mb-6">
          Related Products
        </h3>
        <SkeletonLoader type="product" count={4} />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="font-display text-2xl font-bold text-secondary-dark mb-6">
          Related Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RelatedProducts;