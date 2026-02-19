const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();

// Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  wholesalePrice?: number;
  oldPrice?: number;
  image: string;
  images: string[];
  stock: number;
  categoryId: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  isActive: boolean;
  isFeatured: boolean;
  isExportEligible: boolean;
  minOrderQty: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
  error?: string;
}

// API helper function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Products API
export const productAPI = {
  // Get all products with pagination and filters
  getProducts: async (params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    featured?: boolean;
    exportEligible?: boolean;
  } = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.search) queryParams.append('search', params.search);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.featured) queryParams.append('featured', 'true');
    if (params.exportEligible) queryParams.append('exportEligible', 'true');

    return apiCall<{ data: Product[]; pagination: PaginationMeta }>(
      `?${queryParams.toString()}`
    );
  },

  // Get product by ID
  getProductById: async (id: string) => {
    return apiCall<Product>(`/${id}`);
  },

  // Get product by slug
  getProductBySlug: async (slug: string) => {
    return apiCall<Product>(`/slug/${slug}`);
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 8) => {
    return apiCall<Product[]>(`/featured?limit=${limit}`);
  },

  // Search products
  searchProducts: async (query: string, limit: number = 10) => {
    return apiCall<Product[]>(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },

  // Create product (admin)
  createProduct: async (data: Partial<Product>) => {
    return apiCall<Product>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update product (admin)
  updateProduct: async (id: string, data: Partial<Product>) => {
    return apiCall<Product>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete product (admin)
  deleteProduct: async (id: string) => {
    return apiCall(`/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoryAPI = {
  // Get all categories
  getCategories: async (includeProducts: boolean = false) => {
    return apiCall<Category[]>(
      `/categories${includeProducts ? '?includeProducts=true' : ''}`
    );
  },

  // Get category by ID
  getCategoryById: async (id: string) => {
    return apiCall<Category>(`/categories/${id}`);
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    return apiCall<Category>(`/categories/slug/${slug}`);
  },

  // Get category tree (for navigation)
  getCategoryTree: async () => {
    return apiCall<Category[]>('/categories/tree');
  },

  // Create category (admin)
  createCategory: async (data: Partial<Category>) => {
    return apiCall<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update category (admin)
  updateCategory: async (id: string, data: Partial<Category>) => {
    return apiCall<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete category (admin)
  deleteCategory: async (id: string) => {
    return apiCall(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

export const apiService = {
  products: productAPI,
  categories: categoryAPI,
};

// Axios-like instance for convenience
const api = {
  get: async <T = any>(url: string, config?: any) => {
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    const params = config?.params;
    let fullUrl = `${API_URL}${endpoint}`;
    
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      fullUrl += `?${queryString}`;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: await response.json(),
        },
      };
    }

    return { data: await response.json() };
  },

  post: async <T = any>(url: string, data?: any, config?: any) => {
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    const fullUrl = `${API_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: await response.json(),
        },
      };
    }

    return { data: await response.json() };
  },

  put: async <T = any>(url: string, data?: any, config?: any) => {
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    const fullUrl = `${API_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: await response.json(),
        },
      };
    }

    return { data: await response.json() };
  },

  delete: async <T = any>(url: string, config?: any) => {
    const endpoint = url.startsWith('/') ? url : `/${url}`;
    const fullUrl = `${API_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: await response.json(),
        },
      };
    }

    return { data: await response.json() };
  },
};

export default api;
