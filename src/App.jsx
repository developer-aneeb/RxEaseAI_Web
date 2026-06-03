import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';

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

  return <LandingPage />;
}

export default App;
