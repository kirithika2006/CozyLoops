import api from './api';

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product (admin only)
  createProduct: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (id, formData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products', {
      params: { isFeatured: true, limit }
    });
    return response.data;
  },

  // Get trending products
  getTrendingProducts: async (limit = 8) => {
    const response = await api.get('/products', {
      params: { isTrending: true, limit }
    });
    return response.data;
  },

  // Get latest products
  getLatestProducts: async (limit = 8) => {
    const response = await api.get('/products', {
      params: { sort: '-createdAt', limit }
    });
    return response.data;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products', {
      params: { search: query, ...params }
    });
    return response.data;
  },
};