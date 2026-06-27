import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // If already authenticated, prevent accessing public auth pages
      window.location.hash = '#dashboard';
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return null; // Don't render public auth content while redirecting
  }

  return children;
}
