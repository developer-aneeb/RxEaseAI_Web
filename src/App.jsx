import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import { ToastProvider } from './contexts/ToastContext';
import Spinner from './components/ui/Spinner';

// Temporary Dashboard Placeholder
function DashboardPlaceholder() {
    const logout = useAuthStore((state) => state.logout);
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface dark:bg-slate-950 text-slate-900 dark:text-white p-6">
            <div className="glass-panel p-10 rounded-2xl max-w-md w-full text-center shadow-lg border border-outline-variant/30 dark:border-slate-800">
                <span className="material-symbols-outlined text-5xl text-primary mb-4">dashboard</span>
                <h1 className="text-3xl font-bold mb-2">Workspace Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Welcome back! Your secure healthcare workspace is ready.</p>
                <button 
                    onClick={logout} 
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                </button>
            </div>
        </div>
    );
}

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
                window.location.href = `${window.location.origin}/#dashboard`;
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
                window.location.href = `${window.location.origin}/#dashboard`;
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

    // Public Auth Routes (Redirects to dashboard if already logged in)
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
    if (currentHash === '#dashboard') {
        return <ProtectedRoute><DashboardPlaceholder /></ProtectedRoute>;
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
