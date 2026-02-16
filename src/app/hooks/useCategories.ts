// Hook for loading categories and products from API

import { useState, useEffect } from 'react';
import { categoriesApi } from '../../api/categories';
import type { ApiResponse } from '../../api/types';

interface Category {
  id: number;
  name: string;
  products?: Product[];
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  categoryId?: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await categoriesApi.getAllCategoriesWithProducts();
        if (response.success && response.data && typeof response.data === 'object') {
          // API returns {"categories": [...]} in data
          const data = response.data as any;
          const categoriesData = Array.isArray(data.categories)
            ? data.categories
            : Array.isArray(data)
              ? data
              : [];
          setCategories(categoriesData);
        } else {
          setError(response.message || 'Failed to load categories');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading categories');
        console.error('Error loading categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, isLoading, error };
}
