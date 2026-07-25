import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HomeHero from '../components/sections/home/HomeHero';
import DemoVideoSection from '../components/sections/DemoVideoSection';
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
    
    // Expose lenis globally for scroll buttons
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    if (window.lenis) {
      window.lenis.scrollTo(`#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const homeLinks = [
    // { name: 'Home', href: '#home', onClick: (e) => handleLinkClick(e, 'home-hero') },
    { name: 'Upload Prescription', href: '#upload' },
    { name: 'Prescription History', href: '#history' },
    { name: 'Recommendations', href: '#recommendations' },
    { name: 'Medicine Search', href: '#search' },
    { name: 'Analytics', href: '#analytics' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen relative font-sans transition-colors duration-300">

      {/* Global Navbar customized for Home Page */}
      <Navbar links={homeLinks} />

      {/* Hero Section */}
      <HomeHero />

      {/* Demo Video Section */}
      <DemoVideoSection />

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
