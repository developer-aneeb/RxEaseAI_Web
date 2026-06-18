import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Sun, Moon, ArrowLeft, Mail, Lock, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import { fadeInUp, fadeIn, staggerContainer } from '../animations/variants';

export default function ForgotPassword() {
  const { theme, toggleTheme } = useTheme();

  // Form State
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (!email) {
      alert('Please enter your email address.');
      return;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

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
    <div className="bg-background text-on-background min-h-screen flex flex-col font-geist antialiased bg-grid-pattern relative overflow-x-hidden dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">

      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary/10 dark:bg-tertiary/5 blur-[120px] pointer-events-none"></div>

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
      <main className="flex-grow flex items-start justify-center py-6 md:py-10 px-margin-mobile md:px-stitch-lg xl:px-stitch-xl w-full max-w-container-max mx-auto relative z-10">
        <div className="w-full flex flex-col lg:flex-row gap-stitch-lg md:gap-stitch-xl xl:gap-[80px] items-stretch">

          {/* Left Side: Storytelling (Hidden on mobile) */}
          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex w-[45%] flex-col justify-start px-stitch-lg py-6 border-r border-outline-variant/20 dark:border-slate-800/40 relative"
          >
            <div className="max-w-md mx-auto">

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
                className="font-display-lg text-4xl lg:text-display-lg text-on-surface dark:text-white mb-4 font-semibold leading-tight"
              >
                Recover Access To Your <span className="glow-text">RxEaseAI Workspace</span>
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
            className="w-full lg:w-[55%] p-margin-mobile md:p-stitch-lg pt-6 md:pt-10 max-w-[500px] lg:max-w-[550px] mx-auto order-1 lg:order-2"
          >
            <div className="w-full glass-panel dark:bg-slate-900/60 dark:border-slate-800/80 rounded-2xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-t border-l border-white/60 dark:border-white/10 relative overflow-hidden ai-glow">

              {/* Decorative top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

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
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/25 to-tertiary/25 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,85,201,0.2)]">
                    <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
                  </div>

                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white font-semibold mb-2">Forgot Password?</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">
                      Enter your email address and we'll send you a secure password reset link.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <label className="font-label-sm text-label-sm text-on-surface-variant dark:text-slate-400 mb-2 block" htmlFor="email">Email Address</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-outline dark:text-slate-500 text-[20px]">mail</span>
                        <input
                          className="w-full pl-12 pr-4 py-3 bg-surface dark:bg-slate-950 border border-outline-variant/60 dark:border-slate-800 rounded-lg font-body-md text-body-md text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200"
                          id="email"
                          placeholder="doctor@hospital.com"
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary rounded-lg font-label-md text-label-md text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span>{isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}</span>
                      {!isSubmitting && <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <a className="font-label-md text-label-md text-primary dark:text-indigo-400 hover:text-on-primary-fixed-variant transition-colors" href="#signin">
                      Remember your password? Sign In
                    </a>
                  </div>

                  {/* Security Block */}
                  <div className="mt-4 pt-6 border-t border-outline-variant/30 dark:border-slate-800/60 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
                      <span className="material-symbols-outlined text-secondary text-[16px]">lock</span>
                      <span className="font-label-sm text-label-sm">Secure Auth</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
                      <span className="material-symbols-outlined text-primary text-[16px]">shield</span>
                      <span className="font-label-sm text-label-sm">HIPAA Ready</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
                      <span className="material-symbols-outlined text-tertiary text-[16px]">bolt</span>
                      <span className="font-label-sm text-label-sm">Fast Recovery</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
                      <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                      <span className="font-label-sm text-label-sm">Data Protected</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </main>

      {/* System Status Widget */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-outline-variant/30 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 z-50">
        <div className="w-2 h-2 rounded-full bg-secondary animate-pulse mr-0.5"></div>
        <span className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400">All Systems Operational |80% Uptime</span>
      </div>

    </div>
  );
}