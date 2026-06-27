import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, force redirect to signin page
      window.location.hash = '#signin';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Don't render protected content while redirecting
  }

  return children;
}
