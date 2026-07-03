import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HomeHero from '../components/sections/home/HomeHero';
import HomeWorkflow from '../components/sections/home/HomeWorkflow';
import HomeFeatures from '../components/sections/home/HomeFeatures';
import HomeSecurity from '../components/sections/home/HomeSecurity';
import HomeFaq from '../components/sections/home/HomeFaq';
import HomeCTA from '../components/sections/home/HomeCTA';

export default function HomePage() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const homeLinks = [
    { name: 'Home', href: '#home', onClick: (e) => handleLinkClick(e, 'home-hero') },
    { name: 'Upload', href: '#upload' },
    { name: 'Features', href: '#features', onClick: (e) => handleLinkClick(e, 'features') },
    { name: 'How It Works', href: '#how-it-works', onClick: (e) => handleLinkClick(e, 'how-it-works') },
    { name: 'Security', href: '#security', onClick: (e) => handleLinkClick(e, 'security') },
    { name: 'FAQs', href: '#faq', onClick: (e) => handleLinkClick(e, 'faq') },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen relative font-sans transition-colors duration-300">
      
      {/* Global Navbar customized for Home Page */}
      <Navbar links={homeLinks} />

      {/* Hero Section */}
      <HomeHero />

      {/* Intelligent Workflow Section */}
      <HomeWorkflow />

      {/* Clinical Intelligence Core Features Section */}
      <HomeFeatures />

      {/* Security & Trust Section */}
      <HomeSecurity />

      {/* FAQ Accordion Section */}
      <HomeFaq />

      {/* Final CTA Banner */}
      <HomeCTA />

      {/* Site Footer */}
      <Footer />

    </div>
  );
}
