import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/product/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Button from '../components/common/Button';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const [filters, setFilters] = useState({
    sort: sort,
    minPrice: '',
    maxPrice: '',
    isAvailable: ''
  });

  useEffect(() => {
    fetchData();
  }, [categoryId, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const categoriesResponse = await categoryService.getCategories();
      setCategories(categoriesResponse.categories || []);
      
      // Fetch products with filters
      const productParams = {
        limit: 20
      };
      if (selectedCategory) productParams.category = selectedCategory;
      if (filters.sort) productParams.sort = filters.sort;
      if (filters.minPrice) productParams.minPrice = filters.minPrice;
      if (filters.maxPrice) productParams.maxPrice = filters.maxPrice;
      if (filters.isAvailable) productParams.isAvailable = filters.isAvailable;
      
      const response = await productService.getProducts(productParams);
      setProducts(response.products || []);
      setTotalProducts(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      sort: '-createdAt',
      minPrice: '',
      maxPrice: '',
      isAvailable: ''
    });
    setSelectedCategory('');
    setSearchParams({});
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
  ];

  // Get category name for display
  const getCategoryName = () => {
    if (!selectedCategory) return 'All Products';
    const category = categories.find(c => c._id === selectedCategory);
    return category ? category.name : 'All Products';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-secondary-dark">Shop</h1>
        </div>
        <SkeletonLoader type="product" count={8} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shop - CozyLoops</title>
        <meta name="description" content="Shop our collection of handmade crochet creations" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-secondary-dark">
                {getCategoryName()}
              </h1>
              <p className="text-secondary-dark/60">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 glass-morphism rounded-full hover:shadow-premium transition-all duration-300"
              >
                <FaFilter />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              !selectedCategory
                ? 'bg-gradient-pink text-white shadow-soft'
                : 'bg-primary-babyPink/20 text-secondary-dark hover:bg-primary-babyPink/30'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category._id
                  ? 'bg-gradient-pink text-white shadow-soft'
                  : 'bg-primary-babyPink/20 text-secondary-dark hover:bg-primary-babyPink/30'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-morphism rounded-2xl p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-secondary-dark">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-secondary-dark/60 hover:text-primary-rosePink transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="select-field"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-2">
                  Availability
                </label>
                <select
                  value={filters.isAvailable}
                  onChange={(e) => handleFilterChange('isAvailable', e.target.value)}
                  className="select-field"
                >
                  <option value="">All</option>
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="glass-morphism rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">🧶</div>
            <h3 className="text-2xl font-display text-secondary-dark mb-2">
              No Products Found
            </h3>
            <p className="text-secondary-dark/60 mb-6">
              {selectedCategory 
                ? `No products available in this category yet` 
                : 'No products available at the moment'}
            </p>
            {selectedCategory && (
              <Button onClick={() => handleCategoryClick('')}>
                View All Products
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ShopPage;