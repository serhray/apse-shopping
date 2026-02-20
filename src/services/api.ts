const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();

// Lightweight fetch wrapper for backend API calls (auth, admin, etc.)
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

    const token = localStorage.getItem('auth_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, { method: 'GET', headers });
    if (!response.ok) {
      throw { response: { status: response.status, data: await response.json() } };
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

    const token = localStorage.getItem('auth_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, { method: 'POST', headers, body: JSON.stringify(data) });
    if (!response.ok) {
      throw { response: { status: response.status, data: await response.json() } };
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

    const token = localStorage.getItem('auth_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, { method: 'PUT', headers, body: JSON.stringify(data) });
    if (!response.ok) {
      throw { response: { status: response.status, data: await response.json() } };
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

    const token = localStorage.getItem('auth_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fullUrl, { method: 'DELETE', headers });
    if (!response.ok) {
      throw { response: { status: response.status, data: await response.json() } };
    }
    return { data: await response.json() };
  },
};

export default api;
