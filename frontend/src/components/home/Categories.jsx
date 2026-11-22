import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSeedling, FaGift, FaKey, FaMobileAlt, FaSmile, FaTags } from 'react-icons/fa';
import { categoryService } from '../../services/categoryService';
import SkeletonLoader from '../common/SkeletonLoader';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const getCategoryIcon = (name = '') => {
    const normalized = name.toLowerCase();
    if (normalized.includes('flower')) return FaSeedling;
    if (normalized.includes('bouquet')) return FaGift;
    if (normalized.includes('keychain') || normalized.includes('key chain')) return FaKey;
    if (normalized.includes('phone') || normalized.includes('charm')) return FaMobileAlt;
    if (normalized.includes('plush') || normalized.includes('toy')) return FaSmile;
    if (normalized.includes('gift') || normalized.includes('personal')) return FaGift;
    return FaTags;
  };

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
      <section className="py-16 bg-secondary-gray">
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
    <section className="py-16 bg-secondary-gray">
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
                className="block h-full rounded-2xl border border-secondary-gray bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="mx-auto mb-3 flex aspect-square w-full max-w-40 items-center justify-center overflow-hidden rounded-xl bg-secondary-light p-3">
                  {category.image && category.image !== 'https://via.placeholder.com/400x400?text=Coming+Soon' ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full rounded-lg object-cover"
                      loading="lazy"
                    />
                  ) : (
                    React.createElement(getCategoryIcon(category.name), { className: 'h-10 w-10 text-primary-darkPink', 'aria-hidden': true })
                  )}
                </div>
                <h3 className="flex items-center justify-center gap-2 font-semibold text-secondary-dark text-sm">
                  {React.createElement(getCategoryIcon(category.name), { className: 'h-4 w-4 flex-shrink-0 text-primary-darkPink', 'aria-hidden': true })}
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
