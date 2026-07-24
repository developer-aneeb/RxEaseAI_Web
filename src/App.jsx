import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/prescription/upload/UploadPage';
import ResultPage from './pages/prescription/result/ResultPage';
import HistoryPage from './pages/prescription/history/HistoryPage';
import RecommendationPage from './pages/prescription/recommendation/RecommendationPage';
import PrescriptionAnalytics from './pages/prescription/analytics/PrescriptionAnalytics';
import SearchPage from './pages/search/SearchPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import SettingsPage from './pages/settings/SettingsPage';
import RemindersPage from './pages/reminder/RemindersPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import BillingPage from './pages/billing/BillingPage';
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
        const hash = window.location.hash || '';

        // Handle recovery links and expired/used links
        if (pathname === '/reset-password' || hash.includes('type=recovery') || hash.includes('error_description=')) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const errorDesc = params.get('error_description');

            if (errorDesc) {
                window.location.href = `${window.location.origin}/#reset-password?error=${encodeURIComponent(errorDesc.replace(/\+/g, ' '))}`;
                return;
            } else if (accessToken) {
                localStorage.setItem('rxease_reset_access_token', accessToken);
                if (refreshToken) {
                    localStorage.setItem('rxease_reset_refresh_token', refreshToken);
                }
                window.location.href = `${window.location.origin}/#reset-password`;
                return;
            } else if (pathname === '/reset-password') {
                window.location.href = `${window.location.origin}/#forgot-password`;
                return;
            }
        }
        
        if (pathname === '/verify-email') {
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

    const hashPath = currentHash.split('?')[0];

    // Public Auth Routes (Redirects to home if already logged in)
    if (hashPath === '#signup') {
        return <PublicRoute><SignUp /></PublicRoute>;
    }

    if (hashPath === '#signin') {
        return <PublicRoute><SignIn /></PublicRoute>;
    }

    if (hashPath === '#forgot-password') {
        return <PublicRoute><ForgotPassword /></PublicRoute>;
    }

    if (hashPath === '#reset-password') {
        return <PublicRoute><ResetPassword /></PublicRoute>;
    }

    if (hashPath === '#verify-email') {
        return <PublicRoute><VerifyEmail /></PublicRoute>;
    }

    // Protected Routes (Redirects to signin if NOT logged in)
    if (hashPath === '#home') {
        return <ProtectedRoute><HomePage /></ProtectedRoute>;
    }

    if (hashPath === '#upload') {
        return <ProtectedRoute><UploadPage /></ProtectedRoute>;
    }

    if (hashPath === '#result') {
        return <ProtectedRoute><ResultPage /></ProtectedRoute>;
    }

    if (hashPath === '#history') {
        return <ProtectedRoute><HistoryPage /></ProtectedRoute>;
    }

    if (hashPath === '#recommendations') {
        return <ProtectedRoute><RecommendationPage /></ProtectedRoute>;
    }

    if (hashPath === '#search') {
        return <ProtectedRoute><SearchPage /></ProtectedRoute>;
    }

    if (hashPath === '#analytics') {
        return <ProtectedRoute><AnalyticsPage /></ProtectedRoute>;
    }

    if (hashPath === '#settings') {
        return <ProtectedRoute><SettingsPage /></ProtectedRoute>;
    }

    if (hashPath === '#reminders') {
        return <ProtectedRoute><RemindersPage /></ProtectedRoute>;
    }

    if (hashPath === '#notifications') {
        return <ProtectedRoute><NotificationsPage /></ProtectedRoute>;
    }

    if (hashPath === '#prescription-analytics') {
        return <ProtectedRoute><PrescriptionAnalytics /></ProtectedRoute>;
    }

    if (hashPath === '#billing') {
        return <ProtectedRoute><BillingPage /></ProtectedRoute>;
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
