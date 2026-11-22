import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from 'react-icons/fa';
import { categoryService } from '../../services/categoryService';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        image: null
      });
      setImagePreview(category.image);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image: null });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: null });
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields');
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
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully');
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-secondary-dark">
            Categories
          </h2>
          <p className="text-secondary-dark/60">Manage your product categories</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" />
          New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-premium p-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-primary-babyPink/20">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-secondary-dark">{category.name}</h3>
                <p className="text-sm text-secondary-dark/60 line-clamp-2">
                  {category.description}
                </p>
                <p className="text-xs text-secondary-dark/40 mt-1">
                  {category.productCount || 0} products
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleOpenModal(category)}
                aria-label={`Edit ${category.name}`}
                className="icon-action text-secondary-dark/60 hover:text-primary-rosePink"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                aria-label={`Delete ${category.name}`}
                className="icon-action text-secondary-dark/60 hover:text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="glass-morphism rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-2xl font-display text-secondary-dark mb-2">
            No Categories Yet
          </h3>
          <p className="text-secondary-dark/60">
            Create your first category to organize your products
          </p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-premium"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-xl font-bold text-secondary-dark">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-primary-babyPink/20 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Flowers"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea-field"
                    rows="3"
                    placeholder="Describe this category..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Category Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-primary-babyPink/30 rounded-xl p-4 text-center hover:border-primary-rosePink transition-colors">
                        <FaImage className="text-2xl text-secondary-dark/40 mx-auto mb-2" />
                        <p className="text-sm text-secondary-dark/60">
                          {formData.image ? formData.image.name : 'Click to upload image'}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
