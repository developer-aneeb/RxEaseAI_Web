import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/landing/Hero';
import Features from '../components/sections/landing/Features';
import Workflow from '../components/sections/landing/Workflow';
import Dashboard from '../components/sections/landing/Dashboard';
import Analytics from '../components/sections/landing/Analytics';
import Faq from '../components/sections/landing/Faq';

export default function LandingPage() {
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

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen relative font-sans transition-colors duration-300">
      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features List Section */}
      <Features />

      {/* Interactive Workflow Pipeline Section */}
      <Workflow />

      {/* Dashboard Preview Section */}
      <Dashboard />

      {/* Analytics Statistics Section */}
      <Analytics />

      {/* Accordion FAQ Section */}
      <Faq />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}