import { create } from 'zustand';
import { authService } from '../services/authService';

const normalizeUser = (profileUser) => {
  if (!profileUser) return null;
  return {
    ...profileUser,
    email_confirmed_at: profileUser.email_confirmed_at || 
                        (profileUser.email_verified ? (profileUser.last_sign_in_at || new Date().toISOString()) : null)
  };
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user: normalizeUser(user) }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),

  login: (userData, accessToken, refreshToken) => {
    const normalizedUser = normalizeUser(userData);
    localStorage.setItem('rxease_token', accessToken);
    localStorage.setItem('rxease_refresh_token', refreshToken);
    localStorage.setItem('rxease_user', JSON.stringify(normalizedUser));
    
    set({
      user: normalizedUser,
      isAuthenticated: true,
      isLoading: false
    });

    if (normalizedUser && !normalizedUser.email_confirmed_at) {
      window.location.hash = '#verify-email';
    } else {
      window.location.hash = '#home';
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn("Logout API request failed, clearing local session.", e);
    } finally {
      localStorage.removeItem('rxease_token');
      localStorage.removeItem('rxease_refresh_token');
      localStorage.removeItem('rxease_user');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      window.location.hash = '#signin';
    }
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('rxease_token');
    const refreshToken = localStorage.getItem('rxease_refresh_token');

    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const response = await authService.getProfile();
      set({
        user: normalizeUser(response.data.user),
        isAuthenticated: true
      });
    } catch (error) {
      // If expired, try refreshing
      if (error.response?.status === 401 && refreshToken) {
        try {
          const refreshResponse = await authService.refreshToken(refreshToken);
          const { access_token, refresh_token } = refreshResponse.data;
          
          localStorage.setItem('rxease_token', access_token);
          localStorage.setItem('rxease_refresh_token', refresh_token);
          
          const profileResponse = await authService.getProfile();
          set({
            user: normalizeUser(profileResponse.data.user),
            isAuthenticated: true
          });
        } catch (refreshErr) {
          console.error('Failed to refresh session:', refreshErr);
          await get().logout();
        }
      } else {
        console.error('Session validation failed:', error);
        await get().logout();
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useAuthStore;
