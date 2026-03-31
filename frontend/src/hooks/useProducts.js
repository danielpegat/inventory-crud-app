/**
 * useProducts Hook
 * Manages product list state with pagination, search, and filters.
 * Abstracts all the data fetching logic away from page components.
 */
import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';
import useDebounce from './useDebounce';

export default function useProducts() {
  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce the search input (300ms delay)
  const debouncedSearch = useDebounce(search, 300);

  /**
   * Fetch products from the API with current filters and pagination.
   */
  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getAll({
        page,
        limit: pagination.limit,
        search: debouncedSearch,
        categoryId: categoryFilter || undefined,
        status: statusFilter || undefined,
        sortBy,
        order,
      });

      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryFilter, statusFilter, sortBy, order, pagination.limit]);

  /**
   * Fetch categories for filter dropdowns.
   */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  // Fetch products when filters change (reset to page 1)
  useEffect(() => {
    fetchProducts(1);
  }, [debouncedSearch, categoryFilter, statusFilter, sortBy, order]);

  // Fetch categories once on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * Navigate to a specific page.
   */
  const goToPage = (page) => {
    fetchProducts(page);
  };

  /**
   * Delete a product and refresh the list.
   */
  const deleteProduct = async (id) => {
    try {
      await productService.delete(id);
      await fetchProducts(pagination.page);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete product',
      };
    }
  };

  /**
   * Refresh the current page.
   */
  const refresh = () => fetchProducts(pagination.page);

  return {
    // Data
    products,
    categories,
    pagination,

    // Filters
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    order,
    setOrder,

    // UI state
    loading,
    error,

    // Actions
    goToPage,
    deleteProduct,
    refresh,
  };
}
