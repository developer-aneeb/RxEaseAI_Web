import apiClient from './apiClient';

export const searchService = {
  /**
   * Search medicines with filters, sorting, and pagination
   * GET /search/medicines?query=&brand=&category=&minPrice=&maxPrice=&orderBy=&orderDir=&limit=&offset=
   */
  async searchMedicines(params = {}) {
    const query = new URLSearchParams();
    if (params.query) query.set('query', params.query);
    if (params.brand) query.set('brand', params.brand);
    if (params.category) query.set('category', params.category);
    if (params.minPrice !== undefined) query.set('minPrice', params.minPrice);
    if (params.maxPrice !== undefined) query.set('maxPrice', params.maxPrice);
    if (params.orderBy) query.set('orderBy', params.orderBy);
    if (params.orderDir) query.set('orderDir', params.orderDir);
    if (params.limit) query.set('limit', params.limit);
    if (params.offset !== undefined) query.set('offset', params.offset);

    const response = await apiClient.get(`/search/medicines?${query.toString()}`);
    return response.data;
  },

  /**
   * Autocomplete suggestions for medicine names
   * GET /search/autocomplete?prefix=&limit=
   */
  async autocomplete(prefix, limit = 10) {
    const response = await apiClient.get(`/search/autocomplete?prefix=${encodeURIComponent(prefix)}&limit=${limit}`);
    return response.data;
  },

  /**
   * Get detailed medicine info by ID
   * GET /search/medicines/:medicineId
   */
  async getMedicineDetails(medicineId) {
    const response = await apiClient.get(`/search/medicines/${medicineId}`);
    return response.data;
  },

  /**
   * Get all brands for filtering
   * GET /search/brands
   */
  async getBrands() {
    const response = await apiClient.get('/search/brands');
    return response.data;
  },

  /**
   * Get all categories for filtering
   * GET /search/categories
   */
  async getCategories() {
    const response = await apiClient.get('/search/categories');
    return response.data;
  },
};
