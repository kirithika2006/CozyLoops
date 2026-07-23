import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaTimes, FaImage, 
  FaTag, FaBox, FaDollarSign, FaList 
} from 'react-icons/fa';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    discount: '0',
    stock: '',
    sku: '',
    material: '',
    weight: '',
    dimensions: { length: '', width: '', height: '', unit: 'cm' },
    colorsAvailable: [],
    sizesAvailable: [],
    estimatedDelivery: '3-5 business days',
    careInstructions: '',
    customizable: false,
    tags: [],
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    isAvailable: true,
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        categoryService.getCategories()
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category?._id || product.category || '',
        price: product.price || '',
        discount: product.discount || '0',
        stock: product.stock || '',
        sku: product.sku || '',
        material: product.material || '',
        weight: product.weight || '',
        dimensions: product.dimensions || { length: '', width: '', height: '', unit: 'cm' },
        colorsAvailable: product.colorsAvailable || [],
        sizesAvailable: product.sizesAvailable || [],
        estimatedDelivery: product.estimatedDelivery || '3-5 business days',
        careInstructions: product.careInstructions || '',
        customizable: product.customizable || false,
        tags: product.tags || [],
        isFeatured: product.isFeatured || false,
        isTrending: product.isTrending || false,
        isNewArrival: product.isNewArrival || false,
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        images: product.images || []
      });
      setImagePreviews(product.images?.map(img => img.url) || []);
      setImageFiles([]);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        discount: '0',
        stock: '',
        sku: '',
        material: '',
        weight: '',
        dimensions: { length: '', width: '', height: '', unit: 'cm' },
        colorsAvailable: [],
        sizesAvailable: [],
        estimatedDelivery: '3-5 business days',
        careInstructions: '',
        customizable: false,
        tags: [],
        isFeatured: false,
        isTrending: false,
        isNewArrival: false,
        isAvailable: true,
        images: []
      });
      setImagePreviews([]);
      setImageFiles([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFiles([]);
    setImagePreviews([]);
    setTagInput('');
    setColorInput('');
    setSizeInput('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colorsAvailable.includes(colorInput.trim())) {
      setFormData({ ...formData, colorsAvailable: [...formData.colorsAvailable, colorInput.trim()] });
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setFormData({ ...formData, colorsAvailable: formData.colorsAvailable.filter(c => c !== color) });
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizesAvailable.includes(sizeInput.trim())) {
      setFormData({ ...formData, sizesAvailable: [...formData.sizesAvailable, sizeInput.trim()] });
      setSizeInput('');
    }
  };

  const removeSize = (size) => {
    setFormData({ ...formData, sizesAvailable: formData.sizesAvailable.filter(s => s !== size) });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!formData.name.trim()) {
    toast.error('Product name is required');
    return;
  }
  if (!formData.description.trim()) {
    toast.error('Product description is required');
    return;
  }
  if (!formData.category) {
    toast.error('Please select a category');
    return;
  }
  if (!formData.price || parseFloat(formData.price) <= 0) {
    toast.error('Please enter a valid price');
    return;
  }
  if (!formData.stock || parseInt(formData.stock) < 0) {
    toast.error('Please enter a valid stock quantity');
    return;
  }
  if (!formData.sku.trim()) {
    toast.error('SKU is required');
    return;
  }
  if (!formData.material.trim()) {
    toast.error('Material is required');
    return;
  }
  if (!formData.weight || parseFloat(formData.weight) <= 0) {
    toast.error('Please enter a valid weight');
    return;
  }

  setIsSubmitting(true);

  try {
    const submitData = new FormData();
    
    // Append all form fields
    submitData.append('name', formData.name.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('category', formData.category);
    submitData.append('price', formData.price.toString());
    submitData.append('discount', (formData.discount || '0').toString());
    submitData.append('stock', formData.stock.toString());
    submitData.append('sku', formData.sku.trim());
    submitData.append('material', formData.material.trim());
    submitData.append('weight', formData.weight.toString());
    
    // Append JSON fields
    if (formData.dimensions && (formData.dimensions.length || formData.dimensions.width || formData.dimensions.height)) {
      submitData.append('dimensions', JSON.stringify(formData.dimensions));
    }
    if (formData.colorsAvailable && formData.colorsAvailable.length > 0) {
      submitData.append('colorsAvailable', JSON.stringify(formData.colorsAvailable));
    }
    if (formData.sizesAvailable && formData.sizesAvailable.length > 0) {
      submitData.append('sizesAvailable', JSON.stringify(formData.sizesAvailable));
    }
    if (formData.tags && formData.tags.length > 0) {
      submitData.append('tags', JSON.stringify(formData.tags));
    }
    
    // Append optional fields
    if (formData.estimatedDelivery) submitData.append('estimatedDelivery', formData.estimatedDelivery);
    if (formData.careInstructions) submitData.append('careInstructions', formData.careInstructions);
    
    // Append boolean fields
    submitData.append('customizable', formData.customizable ? 'true' : 'false');
    submitData.append('isFeatured', formData.isFeatured ? 'true' : 'false');
    submitData.append('isTrending', formData.isTrending ? 'true' : 'false');
    submitData.append('isNewArrival', formData.isNewArrival ? 'true' : 'false');
    submitData.append('isAvailable', formData.isAvailable ? 'true' : 'false');

    // Append images
    if (imageFiles.length === 0 && !editingProduct) {
      toast.error('Please upload at least one product image');
      setIsSubmitting(false);
      return;
    }
    
    imageFiles.forEach(file => {
      submitData.append('images', file);
    });

    let response;
    if (editingProduct) {
      response = await productService.updateProduct(editingProduct._id, submitData);
      toast.success('Product updated successfully! ✅');
    } else {
      response = await productService.createProduct(submitData);
      toast.success('Product created successfully! ✅');
    }

    // Refresh product list
    await fetchData();
    handleCloseModal();
  } catch (error) {
    console.error('Error saving product:', error);
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please wait a moment and try again.');
    } else {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  } finally {
    setIsSubmitting(false);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      await fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
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
            Products
          </h2>
          <p className="text-secondary-dark/60">Manage your product inventory</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" />
          New Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-premium overflow-hidden group"
          >
            <div className="aspect-square overflow-hidden bg-primary-lightPink/20">
              <img
                src={product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-secondary-dark">{product.name}</h3>
              <p className="text-sm text-secondary-dark/60 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-primary-rosePink">
                  ₹{product.discount > 0 
                    ? (product.price - (product.price * product.discount / 100)).toFixed(2)
                    : product.price.toFixed(2)}
                </span>
                <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(product)}
                  className="p-2 text-secondary-dark/60 hover:text-primary-rosePink transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-2 text-secondary-dark/60 hover:text-red-500 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="glass-morphism rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-display text-secondary-dark mb-2">
            No Products Yet
          </h3>
          <p className="text-secondary-dark/60">
            Start adding your crochet creations to the store
          </p>
        </div>
      )}

      {/* Modal - Simplified version due to length, full version would be very long */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-premium max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-4 border-b">
                <h3 className="font-display text-xl font-bold text-secondary-dark">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-primary-babyPink/20 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="select-field"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea-field"
                    rows="3"
                    required
                  />
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-field"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="input-field"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* SKU & Material */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Material *
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Weight & Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Weight (g) *
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) => setFormData({
                        ...formData,
                        dimensions: { ...formData.dimensions, length: e.target.value }
                      })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => setFormData({
                        ...formData,
                        dimensions: { ...formData.dimensions, width: e.target.value }
                      })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-dark mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => setFormData({
                        ...formData,
                        dimensions: { ...formData.dimensions, height: e.target.value }
                      })}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Colors Available
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addColor()}
                      className="input-field flex-1"
                      placeholder="Add color..."
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-4 py-2 bg-primary-babyPink/20 rounded-xl hover:bg-primary-babyPink/30 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.colorsAvailable.map((color) => (
                      <span
                        key={color}
                        className="flex items-center gap-1 px-3 py-1 bg-primary-babyPink/20 rounded-full text-sm"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="text-secondary-dark/40 hover:text-red-500"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Sizes Available
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSize()}
                      className="input-field flex-1"
                      placeholder="Add size..."
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-4 py-2 bg-primary-babyPink/20 rounded-xl hover:bg-primary-babyPink/30 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.sizesAvailable.map((size) => (
                      <span
                        key={size}
                        className="flex items-center gap-1 px-3 py-1 bg-primary-babyPink/20 rounded-full text-sm"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="text-secondary-dark/40 hover:text-red-500"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="input-field flex-1"
                      placeholder="Add tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-primary-babyPink/20 rounded-xl hover:bg-primary-babyPink/30 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-primary-babyPink/20 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-secondary-dark/40 hover:text-red-500"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Product Images (Max 10)
                  </label>
                  <div className="border-2 border-dashed border-primary-babyPink/30 rounded-xl p-4 text-center hover:border-primary-rosePink transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="product-images"
                    />
                    <label htmlFor="product-images" className="cursor-pointer">
                      <FaImage className="text-3xl text-secondary-dark/40 mx-auto mb-2" />
                      <p className="text-sm text-secondary-dark/60">
                        Click to upload images (or drag and drop)
                      </p>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.customizable}
                      onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                    />
                    Customizable
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    />
                    Trending
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    />
                    New Arrival
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Care Instructions
                  </label>
                  <textarea
                    value={formData.careInstructions}
                    onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                    className="textarea-field"
                    rows="2"
                    placeholder="Care instructions for this product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-2">
                    Estimated Delivery
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 3-5 business days"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
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
                    {editingProduct ? 'Update Product' : 'Create Product'}
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

export default Products;