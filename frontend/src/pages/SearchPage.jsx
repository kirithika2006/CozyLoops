import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/product/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Button from '../components/common/Button';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: category,
    sort: sort,
    minPrice: '',
    maxPrice: '',
    isAvailable: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [categoriesResult, response] = await Promise.all([
          categoryService.getCategories().catch(() => ({ categories: [] })),
          productService.getProducts(productParams)
        ]);
        if (!active) return;
        setCategories(categoriesResult.categories || []);
        setProducts(response.products || []);
        setTotalProducts(response.pagination?.total || 0);
      } catch (error) {
        if (!active) return;
        setProducts([]);
        setTotalProducts(0);
        setError(error.response?.data?.message || 'Search is temporarily unavailable. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };

    const productParams = { search: query.trim(), limit: 20 };
    if (filters.category) productParams.category = filters.category;
    if (filters.sort) productParams.sort = filters.sort;
    if (filters.minPrice) productParams.minPrice = filters.minPrice;
    if (filters.maxPrice) productParams.maxPrice = filters.maxPrice;
    if (filters.isAvailable) productParams.isAvailable = filters.isAvailable;
    fetchData();
    return () => { active = false; };
  }, [query, filters, retryCount]);

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
      category: '',
      sort: '-createdAt',
      minPrice: '',
      maxPrice: '',
      isAvailable: ''
    });
    setSearchParams({ q: query });
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-averageRating', label: 'Most Popular' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-secondary-dark">
            Searching for: "{query}"
          </h1>
        </div>
        <SkeletonLoader type="product" count={8} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query} - cozy.loopsss_` : 'Search - cozy.loopsss_'}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-secondary-dark">
                {query ? `Results for "${query}"` : 'All Products'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary-dark mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="select-field"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

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
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center" role="alert">
            <p className="font-semibold text-red-800">We couldn’t load search results.</p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button type="button" onClick={() => setRetryCount(count => count + 1)} className="btn-secondary mt-5">
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="glass-morphism rounded-3xl p-12 text-center">
            <FaSearch aria-hidden="true" className="mx-auto mb-4 h-10 w-10 text-primary-darkPink" />
            <h3 className="text-2xl font-display text-secondary-dark mb-2">
              No Products Found
            </h3>
            <p className="text-secondary-dark/60 mb-6">
              {query 
                ? `We couldn't find any products matching "${query}"` 
                : 'No products available at the moment'}
            </p>
            {query && (
              <Link to="/shop">
                <Button variant="primary">Browse All Products</Button>
              </Link>
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

export default SearchPage;
