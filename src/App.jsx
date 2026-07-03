import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import { ToastProvider } from './contexts/ToastContext';
import Spinner from './components/ui/Spinner';
import Button from './components/ui/Button';
import MaterialIcon from './components/ui/MaterialIcon';


function MainRouter() {
    const [currentHash, setCurrentHash] = useState(window.location.hash || '#');
    const isLoading = useAuthStore((state) => state.isLoading);
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    const pathname = window.location.pathname;
    const isRedirectPath = pathname === '/reset-password' || 
                           pathname === '/verify-email' ||
                           pathname.startsWith('/auth/oauth/success') || 
                           pathname.startsWith('/auth/oauth/error');

    // Restore session on mount
    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        if (pathname === '/reset-password') {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            if (accessToken) {
                localStorage.setItem('rxease_reset_access_token', accessToken);
                if (refreshToken) {
                    localStorage.setItem('rxease_reset_refresh_token', refreshToken);
                }
                window.location.href = `${window.location.origin}/#reset-password`;
            } else {
                window.location.href = `${window.location.origin}/#signin`;
            }
        } else if (pathname === '/verify-email') {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            if (accessToken) {
                localStorage.setItem('rxease_token', accessToken);
                if (refreshToken) {
                    localStorage.setItem('rxease_refresh_token', refreshToken);
                }
                window.location.href = `${window.location.origin}/#home`;
            } else {
                window.location.href = `${window.location.origin}/#verify-email`;
            }
        } else if (pathname.startsWith('/auth/oauth/success')) {
            const params = new URLSearchParams(window.location.search);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            if (accessToken) {
                localStorage.setItem('rxease_token', accessToken);
                if (refreshToken) {
                    localStorage.setItem('rxease_refresh_token', refreshToken);
                }
                window.location.href = `${window.location.origin}/#home`;
            } else {
                window.location.href = `${window.location.origin}/#signin`;
            }
        } else if (pathname.startsWith('/auth/oauth/error')) {
            const params = new URLSearchParams(window.location.search);
            const error = params.get('error') || 'oauth_failed';
            window.location.href = `${window.location.origin}/#signin?error=${encodeURIComponent(error)}`;
        }
    }, [pathname]);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || '#');
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (isLoading || isRedirectPath) {
        return <Spinner fullPage={true} />;
    }

    // Public Auth Routes (Redirects to home if already logged in)
    if (currentHash === '#signup') {
        return <PublicRoute><SignUp /></PublicRoute>;
    }

    if (currentHash === '#signin') {
        return <PublicRoute><SignIn /></PublicRoute>;
    }

    if (currentHash === '#forgot-password') {
        return <PublicRoute><ForgotPassword /></PublicRoute>;
    }

    if (currentHash === '#reset-password') {
        return <PublicRoute><ResetPassword /></PublicRoute>;
    }

    if (currentHash === '#verify-email') {
        return <PublicRoute><VerifyEmail /></PublicRoute>;
    }

    // Protected Routes (Redirects to signin if NOT logged in)
    if (currentHash === '#home') {
        return <ProtectedRoute><HomePage /></ProtectedRoute>;
    }

    if (currentHash === '#upload') {
        return <ProtectedRoute><UploadPage /></ProtectedRoute>;
    }

    // Unprotected Public Routes (e.g., Marketing Landing Page)
    return <LandingPage />;
}

function App() {
    return (
        <ToastProvider>
            <MainRouter />
        </ToastProvider>
    );
}

export default App;
