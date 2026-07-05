import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('rxease-auth-storage');
    const token = authStorage ? JSON.parse(authStorage).state?.token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if unauthorized (401) and handle token expiration/logout
    if (error.response && error.response.status === 401) {
      // Clear token and user details on unauthorized
      localStorage.removeItem('rxease-auth-storage');
      
      // Notify components or redirect if not already on public route
      const currentHash = window.location.hash;
      const isPublicRoute = [
        '#signin',
        '#signup',
        '#forgot-password',
        '#reset-password',
        '#verify-email',
        '#',
        ''
      ].includes(currentHash);

      if (!isPublicRoute) {
        window.location.hash = '#signin';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
