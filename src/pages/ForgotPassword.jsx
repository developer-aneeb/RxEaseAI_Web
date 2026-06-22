import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Sun, Moon, ArrowLeft, Mail, Lock, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import MaterialIcon from '../components/ui/MaterialIcon';
import { fadeInUp, fadeIn, staggerContainer } from '../animations/variants';

export default function ForgotPassword() {
  const { theme, toggleTheme } = useTheme();

  // Form State
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Recovery Flow State (for visual pipeline progress animation)
  const [flowStep, setFlowStep] = useState(0);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Animate flow step icon indicators sequentially
    const flowInterval = setInterval(() => {
      setFlowStep((prev) => (prev + 1) % 4);
    }, 2500);

    return () => clearInterval(flowInterval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Please enter your email address.';
    } else {
      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate reset link delivery API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Auto-redirect to sign-in page after 3.5 seconds
      setTimeout(() => {
        window.location.hash = '#signin';
      }, 3500);
    }, 1500);
  };

  return (
    <div className="bg-[#f8f9fa] text-slate-900 min-h-screen flex flex-col font-geist antialiased bg-grid-pattern relative overflow-x-hidden dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">

      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-50">
        <a href="#" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Activity className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            RxEaseAI<span className="text-indigo-500">AI</span>
          </span>
        </a>
        <div className="flex items-center gap-4">
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
          <a
            href="#signin"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-10 px-6 md:px-12 w-full max-w-[1200px] mx-auto relative z-10">
        <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-20 xl:gap-28 items-center justify-between">

          {/* Left Side: Storytelling (Hidden on mobile) */}
          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex w-1/2 flex-col justify-start py-6 relative"
          >
            <div className="max-w-[480px]">

              {/* Badge */}
              <motion.div
                variants={fadeInUp(20, 0.5)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-primary-fixed dark:border-primary/30 mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-1"></div>
                <span className="font-label-sm text-[11px] text-primary dark:text-indigo-400 uppercase tracking-wider font-semibold">SECURE ACCOUNT RECOVERY</span>
              </motion.div>

              {/* Typography */}
              <motion.h1
                variants={fadeInUp(20, 0.5)}
                className="font-display-lg text-4xl lg:text-[44px] text-slate-900 dark:text-white mb-5 font-bold leading-[1.15] tracking-tight"
              >
                Recover Access To Your <span className="text-blue-600 dark:text-blue-500">RxEaseAI Workspace</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp(20, 0.5)}
                className="font-body-lg text-body-lg text-on-surface-variant dark:text-slate-350 mb-6"
              >
                Forgot your password? No problem. Enter your registered email address and we'll send you a secure password reset link.
              </motion.p>

              {/* Feature Cards */}
              <motion.div variants={fadeInUp(20, 0.5)} className="space-y-3 mb-6">
                <div className="glass-panel p-3.5 rounded-xl flex items-center gap-4 animate-float bg-surface/5 backdrop-blur-md border border-outline-variant/20 dark:border-slate-800/50">
                  <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
                  <span className="font-label-md text-label-md text-on-surface dark:text-slate-200">End-to-End Secure Recovery</span>
                </div>
                <div className="glass-panel p-3.5 rounded-xl flex items-center gap-4 animate-float-delayed bg-surface/5 backdrop-blur-md border border-outline-variant/20 dark:border-slate-800/50">
                  <span className="material-symbols-outlined text-secondary text-[24px]">bolt</span>
                  <span className="font-label-md text-label-md text-on-surface dark:text-slate-200">Reset Link Delivered Instantly</span>
                </div>
                <div className="glass-panel p-3.5 rounded-xl flex items-center gap-4 animate-float bg-surface/5 backdrop-blur-md border border-outline-variant/20 dark:border-slate-800/50" style={{ animationDelay: '2s' }}>
                  <span className="material-symbols-outlined text-tertiary text-[24px]">shield</span>
                  <span className="font-label-md text-label-md text-on-surface dark:text-slate-200 font-medium">HIPAA-Compliant Authentication</span>
                </div>
              </motion.div>

              {/* Recovery Flow Visualization */}
              <motion.div
                variants={fadeInUp(20, 0.5)}
                className="flex items-center justify-between glass-panel p-4 rounded-xl relative bg-surface/5 dark:bg-slate-900/40 border border-outline-variant/20 dark:border-slate-800/50"
              >
                <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-outline-variant/30 dark:bg-slate-800 -z-10 -translate-y-1/2">
                  <div
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${flowStep * 33.3}%` }}
                  ></div>
                </div>

                {/* Step 1: Mail */}
                <div className={`flex flex-col items-center bg-white dark:bg-slate-950 w-9 h-9 rounded-full justify-center shadow-sm border z-10 transition-colors duration-300 ${flowStep >= 0 ? 'border-primary text-primary' : 'border-outline-variant/20 text-outline'
                  }`}>
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>

                {/* Step 2: Verification */}
                <div className={`flex flex-col items-center bg-white dark:bg-slate-950 w-9 h-9 rounded-full justify-center shadow-sm border z-10 transition-colors duration-300 ${flowStep >= 1 ? 'border-primary text-primary animate-pulse' : 'border-outline-variant/20 text-outline'
                  }`}>
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>

                {/* Step 3: Link Generation */}
                <div className={`flex flex-col items-center bg-white dark:bg-slate-950 w-9 h-9 rounded-full justify-center shadow-sm border z-10 transition-colors duration-300 ${flowStep >= 2 ? 'border-primary text-primary' : 'border-outline-variant/20 text-outline'
                  }`}>
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </div>

                {/* Step 4: Key reset */}
                <div className={`flex flex-col items-center bg-white dark:bg-slate-950 w-9 h-9 rounded-full justify-center shadow-sm border z-10 transition-colors duration-300 ${flowStep >= 3 ? 'border-primary text-primary' : 'border-outline-variant/20 text-outline'
                  }`}>
                  <span className="material-symbols-outlined text-[18px]">key</span>
                </div>
              </motion.div>

              {/* Trust Metrics */}
              <motion.div
                variants={fadeInUp(20, 0.5)}
                className="mt-6 grid grid-cols-2 gap-6 pt-6 border-t border-outline-variant/20 dark:border-slate-800/40"
              >
                <div>
                  <div className="font-headline-lg text-headline-lg text-on-surface dark:text-white mb-0.5 font-semibold">99.98%</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant dark:text-slate-400">Uptime</div>
                </div>
                <div>
                  <div className="font-headline-lg text-headline-lg text-on-surface dark:text-white mb-0.5 font-semibold">256-bit</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant dark:text-slate-400">Encryption</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Right Side: Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[45%] max-w-[480px] mx-auto order-1 lg:order-2"
          >
            <div className="w-full bg-white dark:bg-slate-900/80 dark:border-slate-800/80 rounded-[24px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-white/10 relative overflow-hidden">

              {/* Decorative top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 hidden"></div>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center relative z-10 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 shadow-sm">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface dark:text-white font-semibold mb-2">Reset Link Sent!</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400 max-w-[320px] mb-8">
                    We've sent a secure password reset link to <span className="font-semibold text-on-surface dark:text-white">{email}</span>.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">Redirecting to Sign In...</span>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col gap-6">
                  {/* Top Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 mb-2">
                    <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
                  </div>

                  <div>
                    <h2 className="text-3xl md:text-[34px] text-slate-900 dark:text-white font-bold mb-3 tracking-tight">Forgot Password?</h2>
                    <p className="font-body-md text-slate-600 dark:text-slate-400">
                      Enter your email address and we'll send you a secure password reset link.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-outline-variant/50 dark:border-slate-800'} bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface dark:text-white`}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
                        required
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email}</p>}

                    <button
                      className="w-full py-3.5 px-4 bg-[#046B46] hover:bg-[#035939] rounded-lg text-white font-medium shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span>{isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}</span>
                      {!isSubmitting && <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <a className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:text-blue-800 transition-colors" href="#signin">
                      Remember your password? Sign In
                    </a>
                  </div>

                  {/* Security Block */}
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-y-4 gap-x-2">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[#046B46] text-[18px]">lock</span>
                      <span className="text-sm font-medium">Secure Auth</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]">shield</span>
                      <span className="text-sm font-medium">HIPAA Ready</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-purple-600 text-[18px]">bolt</span>
                      <span className="text-sm font-medium">Fast Recovery</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-[#046B46] text-[18px]">verified</span>
                      <span className="text-sm font-medium">Data Protected</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </main>

      {/* System Status Widget */}
      <div className="fixed bottom-6 left-6 py-2 px-0 flex items-center gap-2 z-50">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">All Systems Operational | 99.98% Uptime</span>
      </div>

    </div>
  );
}