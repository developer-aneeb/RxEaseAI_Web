import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${API_URL}/api/v1`;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getAuthStorage = () => {
  try {
    const raw = localStorage.getItem('rxease-auth-storage');
    return raw ? JSON.parse(raw)?.state : null;
  } catch {
    return null;
  }
};

const clearAuth = () => {
  localStorage.removeItem('rxease-auth-storage');
};

const updateAuthTokens = (accessToken, refreshToken) => {
  try {
    const raw = localStorage.getItem('rxease-auth-storage');
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.state.token = accessToken;
      parsed.state.refreshToken = refreshToken;
      localStorage.setItem('rxease-auth-storage', JSON.stringify(parsed));
    }
  } catch {
    // Ignore parse errors
  }
};

// Request interceptor — attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    const authState = getAuthStorage();
    const token = authState?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto-refresh on 401, handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response at all (network error), reject immediately
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Only attempt refresh on 401 and if we haven't already retried this request
    if (status === 401 && !originalRequest._retry) {
      const authState = getAuthStorage();
      const storedRefreshToken = authState?.refreshToken;

      // If no refresh token or this is already a refresh/login call, bail out
      if (
        !storedRefreshToken ||
        originalRequest.url?.includes('/auth/refresh-token') ||
        originalRequest.url?.includes('/auth/login')
      ) {
        clearAuth();
        const currentHash = window.location.hash;
        const publicRoutes = ['#signin', '#signup', '#forgot-password', '#reset-password', '#verify-email', '#', ''];
        if (!publicRoutes.includes(currentHash)) {
          window.location.hash = '#signin';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE}/auth/refresh-token`, {
          refresh_token: storedRefreshToken,
        });

        const { access_token, refresh_token } = refreshResponse.data?.data || {};
        if (access_token) {
          updateAuthTokens(access_token, refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          processQueue(null, access_token);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        window.location.hash = '#signin';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Also export a raw client for legacy /auth routes that don't use /api/v1 prefix
export const authApiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

authApiClient.interceptors.request.use(
  (config) => {
    const authState = getAuthStorage();
    const token = authState?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
