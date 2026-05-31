import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, ChevronRight, Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import Button from '../ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glassmorphism py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              RxEase<span className="text-indigo-500">AI</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA & Theme Controls */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              animate={true}
              aria-label="Toggle Theme"
              className="p-2.5!"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            
            <Button variant="accent" size="sm" icon={ChevronRight}>
              Get Started
            </Button>
          </div>

          {/* Mobile menu and theme buttons */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              animate={true}
              aria-label="Toggle Theme"
              className="p-2!"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2!"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glassmorphism border-t border-slate-200 dark:border-slate-800"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/55 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800/80 px-3 flex flex-col gap-3">
                <Button variant="ghost" className="w-full text-center py-2.5">
                  Sign In
                </Button>
                <Button variant="accent" className="w-full text-center py-2.5">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
