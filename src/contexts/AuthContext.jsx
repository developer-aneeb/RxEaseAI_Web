import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import Spinner from '../components/ui/Spinner';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeUser = (profileUser) => {
    if (!profileUser) return null;
    return {
      ...profileUser,
      email_confirmed_at: profileUser.email_confirmed_at || 
                          (profileUser.email_verified ? (profileUser.last_sign_in_at || new Date().toISOString()) : null)
    };
  };

  const logout = useCallback(async () => {
    try {
      // Clear backend session
      await authService.logout();
    } catch (e) {
      console.warn("Logout API request failed, clearing local session.", e);
    } finally {
      localStorage.removeItem('rxease_token');
      localStorage.removeItem('rxease_refresh_token');
      localStorage.removeItem('rxease_user');
      setUser(null);
      setIsAuthenticated(false);
      window.location.hash = '#signin';
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('rxease_token');
      const refreshToken = localStorage.getItem('rxease_refresh_token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        setUser(normalizeUser(response.data.user));
        setIsAuthenticated(true);
      } catch (error) {
        // If expired, try refreshing
        if (error.response?.status === 401 && refreshToken) {
          try {
            const refreshResponse = await authService.refreshToken(refreshToken);
            const { access_token, refresh_token } = refreshResponse.data;
            
            localStorage.setItem('rxease_token', access_token);
            localStorage.setItem('rxease_refresh_token', refresh_token);
            
            const profileResponse = await authService.getProfile();
            setUser(normalizeUser(profileResponse.data.user));
            setIsAuthenticated(true);
          } catch (refreshErr) {
            console.error('Failed to refresh session:', refreshErr);
            logout();
          }
        } else {
          console.error('Session validation failed:', error);
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  const login = (userData, accessToken, refreshToken) => {
    const normalizedUser = normalizeUser(userData);
    localStorage.setItem('rxease_token', accessToken);
    localStorage.setItem('rxease_refresh_token', refreshToken);
    localStorage.setItem('rxease_user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    setIsAuthenticated(true);
    
    if (normalizedUser && !normalizedUser.email_confirmed_at) {
      window.location.hash = '#verify-email';
    } else {
      window.location.hash = '#dashboard';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {isLoading ? <Spinner fullPage={true} /> : children}
    </AuthContext.Provider>
  );
}
