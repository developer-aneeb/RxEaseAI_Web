import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, force redirect to signin page
      window.location.hash = '#signin';
    } else if (user && !user.email_confirmed_at) {
      // If authenticated but email is not verified, redirect to verify-email
      window.location.hash = '#verify-email';
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || (user && !user.email_confirmed_at)) {
    return null; // Don't render protected content while redirecting
  }

  return children;
}
