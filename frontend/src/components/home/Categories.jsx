import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import SkeletonLoader from '../common/SkeletonLoader';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategories();
        setCategories(response.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Shop by Category</h2>
          <SkeletonLoader type="card" count={6} />
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-2">Shop by Category</h2>
          <p className="text-secondary-dark/60">Find your perfect crochet creation</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Link
                to={`/shop?category=${category._id}`}
                className="block glass-morphism rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-premium"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-pink/10 flex items-center justify-center">
                  {category.image && category.image !== 'https://via.placeholder.com/400x400?text=Coming+Soon' ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-3xl">🧶</span>
                  )}
                </div>
                <h3 className="font-semibold text-secondary-dark text-sm">
                  {category.name}
                </h3>
                <p className="text-xs text-secondary-dark/60 mt-1">
                  {category.productCount || 0} items
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.name.trim()) {
    toast.error('Category name is required');
    return;
  }
  if (!formData.description.trim()) {
    toast.error('Category description is required');
    return;
  }

  setIsSubmitting(true);
  
  try {
    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    let response;
    if (editingCategory) {
      response = await categoryService.updateCategory(editingCategory._id, submitData);
      toast.success('Category updated successfully!');
    } else {
      response = await categoryService.createCategory(submitData);
      toast.success('Category created successfully!');
    }

    await fetchCategories();
    handleCloseModal();
  } catch (error) {
    console.error('Error saving category:', error);
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please wait a moment and try again.');
    } else {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  } finally {
    setIsSubmitting(false);
  }
};

export default Categories;