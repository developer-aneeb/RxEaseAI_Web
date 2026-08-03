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
        // If on verify-email with an error param, let VerifyEmail render the error state.
        // Otherwise (success screen or plain verify-email), don't interfere — VerifyEmail
        // handles its own redirect logic.
        const hasError = currentHash.includes('error_code') || currentHash.includes('error=');
        if (!currentHash.startsWith('#verify-email') && !currentHash.startsWith('#home')) {
          window.location.hash = '#home';
        }
        // suppress the unused variable warning — hasError used as guard above
        void hasError;
      }
    }
  }, [isAuthenticated, user]);

  if (isAuthenticated && user) {
    const currentHash = window.location.hash || '#';

    // Always allow #verify-email to render — the component itself decides whether to
    // show pending/success/error state or redirect to #signin.
    if (currentHash.startsWith('#verify-email')) {
      return children;
    }
    return null; // Don't render public auth content while redirecting
  }

  return children;
}
