// Categories API endpoints

import { apiClient } from './client';
import type { ApiResponse, CategoriesResponse } from './types';

export const categoriesApi = {
  /**
   * Get categories with their products
   * GET /categories/products/all
   * Requires: SessionHeader
   */
  async getAllCategoriesWithProducts(): Promise<CategoriesResponse> {
    return apiClient.get<{ categories: any[] }>('/categories/products/all', true);
  },
};
