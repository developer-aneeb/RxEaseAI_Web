import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      const isVerified = !!user.email_confirmed_at;
      const currentHash = window.location.hash || '#';

      if (!isVerified) {
        if (!currentHash.startsWith('#verify-email')) {
          window.location.hash = '#verify-email';
        }
      } else {
        // Don't redirect away from #verify-email while the success screen is showing
        // (the page auto-closes after its countdown; forcing #home here would skip it)
        if (!currentHash.startsWith('#verify-email') && !currentHash.startsWith('#home')) {
          window.location.hash = '#home';
        }
      }
    }
  }, [isAuthenticated, user]);

  if (isAuthenticated && user) {
    const isVerified = !!user.email_confirmed_at;
    const currentHash = window.location.hash || '#';

    // Allow VerifyEmail to render for unverified users, and also while a just-verified
    // user is still on the success/countdown screen.
    if (currentHash.startsWith('#verify-email')) {
      return children;
    }
    return null; // Don't render public auth content while redirecting
  }

  return children;
}
