import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const isVerified = !!user.email_confirmed_at;
      const currentHash = window.location.hash || '#';

      if (!isVerified) {
        if (!currentHash.startsWith('#verify-email')) {
          window.location.hash = '#verify-email';
        }
      } else {
        if (!currentHash.startsWith('#dashboard')) {
          window.location.hash = '#dashboard';
        }
      }
    }
  }, [isAuthenticated, user]);

  if (isAuthenticated && user) {
    const isVerified = !!user.email_confirmed_at;
    const currentHash = window.location.hash || '#';

    // Allow rendering VerifyEmail if authenticated but not verified
    if (!isVerified && currentHash.startsWith('#verify-email')) {
      return children;
    }
    return null; // Don't render public auth content while redirecting
  }

  return children;
}
