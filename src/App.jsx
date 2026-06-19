import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
    const [currentHash, setCurrentHash] = useState(window.location.hash || '#');

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash || '#');
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (currentHash === '#signup') {
        return <SignUp />;
    }

    if (currentHash === '#signin') {
        return <SignIn />;
    }

    if (currentHash === '#forgot-password') {
        return <ForgotPassword />;
    }

    if (currentHash === '#reset-password') {
        return <ResetPassword />;
    }

    return <LandingPage />;
}

export default App;
