/**
 * Product Service
 * API calls for product CRUD operations and analytics.
 */
import api from './api';

const productService = {
  /**
   * Get paginated product list with optional filters.
   * @param {Object} params - { page, limit, search, categoryId, status, sortBy, order }
   */
  getAll: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  /** Get a single product by ID */
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  /** Create a new product */
  create: async (productData) => {
    const { data } = await api.post('/products', productData);
    return data;
  },

  /** Update an existing product */
  update: async (id, productData) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  /** Delete a product */
  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  /** Get all categories for form dropdowns */
  getCategories: async () => {
    const { data } = await api.get('/products/categories');
    return data;
  },

  /** Get dashboard analytics summary */
  getAnalytics: async () => {
    const { data } = await api.get('/analytics/summary');
    return data;
  },
};

export default productService;
