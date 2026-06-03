import { useState, useEffect } from 'react';
import { Activity, Sun, Moon, ArrowLeft } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';

export default function SignUp() {
  const { theme, toggleTheme } = useTheme();
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Stats Counter state
  const [accuracy, setAccuracy] = useState(0);
  const [prescriptions, setPrescriptions] = useState(0);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Accuracy count up to 99.2
    let currentAcc = 0;
    const accInterval = setInterval(() => {
      currentAcc += 1.5;
      if (currentAcc >= 99.2) {
        setAccuracy(99.2);
        clearInterval(accInterval);
      } else {
        setAccuracy(parseFloat(currentAcc.toFixed(1)));
      }
    }, 16);

    // Prescriptions count up to 50
    let currentPres = 0;
    const presInterval = setInterval(() => {
      currentPres += 1.2;
      if (currentPres >= 50) {
        setPrescriptions(50);
        clearInterval(presInterval);
      } else {
        setPrescriptions(Math.floor(currentPres));
      }
    }, 24);

    return () => {
      clearInterval(accInterval);
      clearInterval(presInterval);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    if (!terms) {
      alert('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API registration call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        // Redirect to dashboard or landing page
        window.location.hash = '#';
      }, 2000);
    }, 1500);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-geist antialiased bg-grid-pattern relative overflow-x-hidden dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-50">
        <a href="#" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Activity className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            RxEase<span className="text-indigo-500">AI</span>
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
            href="#"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-lg xl:p-xl w-full max-w-container-max mx-auto relative z-10">
        <div className="w-full flex flex-col lg:flex-row gap-lg md:gap-xl xl:gap-[80px] items-stretch">
          
          {/* Left Panel: Storytelling/Showcase (55%) */}
          <div className="flex-1 lg:w-[55%] flex flex-col justify-center space-y-lg order-2 lg:order-1 pt-xl lg:pt-0">
            <div className="space-y-md animate-fade-in-up">
              <div className="inline-flex items-center gap-xs px-sm py-xs rounded-full glass-panel border border-primary/20 text-primary dark:border-primary/30 relative">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-ring mr-1"></div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">AI-Powered Prescription Intelligence</span>
              </div>
              <h1 className="font-display-lg text-[36px] md:text-5xl font-semibold text-on-surface dark:text-white leading-tight">
                Join the Future of <br className="hidden lg:block"/>
                <span className="text-gradient font-bold">Prescription Intelligence</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-slate-350 max-w-[540px]">
                Transform handwritten prescriptions into verified medicine recommendations, reminders, analytics, and digital healthcare records using AI.
              </p>
            </div>

            {/* Trust Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md animate-fade-in-up delay-100 border-y border-outline-variant/30 dark:border-slate-800 py-md">
              <div className="flex flex-col">
                <span className="text-[28px] font-bold text-on-surface dark:text-white font-headline-lg">{accuracy}%</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Accuracy</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[28px] font-bold text-on-surface dark:text-white font-headline-lg">&lt;2s</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Processing</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[28px] font-bold text-on-surface dark:text-white font-headline-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">HIPAA Ready</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[28px] font-bold text-on-surface dark:text-white font-headline-lg">{prescriptions}K+</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Prescriptions</span>
              </div>
            </div>

            {/* AI Pipeline Visualization (Large) */}
            <div className="relative animate-fade-in-up delay-200 mt-lg hidden md:block">
              <h3 className="font-label-md text-label-md text-on-surface-variant dark:text-slate-400 mb-md uppercase tracking-wider">Intelligence Pipeline</h3>
              <div className="flex items-center justify-between relative px-xs py-md">
                
                {/* Connecting line */}
                <div className="absolute left-[30px] right-[30px] top-1/2 -translate-y-1/2 h-[2px] bg-outline-variant/20 dark:bg-slate-800 z-0"></div>
                
                {/* Glowing animated line */}
                <div className="absolute left-[30px] right-[30px] top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-flow z-0 opacity-50"></div>
                
                {/* Nodes */}
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border-2 border-primary/20 dark:border-primary/40 flex items-center justify-center text-primary pipeline-node-1 transition-all">
                    <span className="material-symbols-outlined">upload_file</span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface dark:text-slate-300 font-medium">Upload</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border-2 border-primary/20 dark:border-primary/40 flex items-center justify-center text-primary pipeline-node-2 transition-all">
                    <span className="material-symbols-outlined">troubleshoot</span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface dark:text-slate-300 font-medium">YOLO</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border-2 border-primary/20 dark:border-primary/40 flex items-center justify-center text-primary pipeline-node-3 transition-all">
                    <span className="material-symbols-outlined">text_snippet</span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface dark:text-slate-300 font-medium">OCR</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border-2 border-primary/20 dark:border-primary/40 flex items-center justify-center text-secondary pipeline-node-4 transition-all">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface dark:text-slate-300 font-medium">Verify</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border-2 border-primary/20 dark:border-primary/40 flex items-center justify-center text-tertiary pipeline-node-5 transition-all">
                    <span className="material-symbols-outlined">medication</span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface dark:text-slate-300 font-medium">Recommend</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-xs">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border-2 border-primary/20 dark:border-primary/40 flex items-center justify-center text-primary pipeline-node-6 transition-all">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <span className="font-label-sm text-[11px] text-on-surface dark:text-slate-300 font-medium">Analytics</span>
                </div>
              </div>
            </div>

            {/* Mini Dashboard Preview & Floating Cards */}
            <div className="relative mt-lg animate-fade-in-up delay-300 h-[240px] hidden lg:block">
              <div className="absolute inset-0 bg-surface-container-lowest dark:bg-slate-900 rounded-xl border border-outline-variant/30 dark:border-slate-800/80 shadow-lg overflow-hidden flex flex-col">
                <div className="h-8 bg-surface-container-low dark:bg-slate-950 border-b border-outline-variant/30 dark:border-slate-800/80 flex items-center px-sm gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fbbc05]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/80"></div>
                  <div className="ml-auto text-[10px] font-label-sm text-on-surface-variant dark:text-slate-400">Workspace Preview</div>
                </div>
                <div className="p-md flex gap-md h-full">
                  <div className="w-1/3 flex flex-col gap-2">
                    <div className="h-4 w-3/4 bg-surface-variant dark:bg-slate-850 rounded"></div>
                    <div className="h-2 w-1/2 bg-surface-container-highest dark:bg-slate-800 rounded mb-4"></div>
                    <div className="h-[100px] w-full bg-surface-container dark:bg-slate-950 rounded-lg border border-outline-variant/20 dark:border-slate-800/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline-variant/50 dark:text-slate-600 text-[32px]">receipt_long</span>
                    </div>
                  </div>
                  <div className="w-2/3 flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-1/3 bg-surface-variant dark:bg-slate-850 rounded"></div>
                      <div className="h-6 w-16 bg-secondary/20 dark:bg-secondary/10 text-secondary text-[11px] rounded-full flex items-center justify-center font-bold">Active</div>
                    </div>
                    <div className="h-[40px] w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800/80 rounded flex items-center px-3 gap-3">
                      <div className="w-6 h-6 rounded bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px] text-primary dark:text-primary-fixed-dim">medication</span>
                      </div>
                      <div className="h-2 w-1/2 bg-surface-variant dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-[40px] w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800/80 rounded flex items-center px-3 gap-3">
                      <div className="w-6 h-6 rounded bg-tertiary/10 dark:bg-tertiary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px] text-tertiary dark:text-tertiary-fixed-dim">science</span>
                      </div>
                      <div className="h-2 w-1/3 bg-surface-variant dark:bg-slate-800 rounded"></div>
                    </div>
                    <div className="h-[40px] w-full bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800/80 rounded flex items-center px-3 gap-3">
                      <div className="w-6 h-6 rounded bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px] text-secondary dark:text-secondary-fixed-dim">savings</span>
                      </div>
                      <div className="h-2 w-2/3 bg-surface-variant dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -right-6 top-4 glass-panel dark:glassmorphism rounded-lg p-3 flex items-center gap-3 animate-float shadow-xl z-20 w-[260px]">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <p className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400 leading-tight">Medicine Detected</p>
                  <p className="font-label-md text-[13px] text-on-surface dark:text-white font-semibold leading-tight">Amoxicillin 500mg</p>
                  <p className="font-label-sm text-[10px] text-secondary mt-0.5">99.8% Confidence</p>
                </div>
              </div>
              
              <div className="absolute -left-4 bottom-8 glass-panel dark:glassmorphism rounded-lg p-3 flex items-center gap-3 animate-float-delayed shadow-xl z-20">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
                <div>
                  <p className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400 leading-tight">Affordability</p>
                  <p className="font-label-md text-[13px] text-primary dark:text-primary-fixed-dim font-semibold leading-tight">Save 42% found</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Signup Form (45%) */}
          <div className="flex-1 lg:w-[45%] w-full max-w-[500px] mx-auto order-1 lg:order-2 animate-fade-in-up delay-400">
            <div className="glass-panel dark:bg-slate-900/60 dark:border-slate-800/80 rounded-2xl p-lg flex flex-col gap-md ai-glow relative overflow-hidden border-t border-l border-white/60 dark:border-white/10">
              
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="text-left mb-sm relative z-10">
                <h2 className="font-headline-md text-[26px] text-on-surface dark:text-white font-semibold mb-xs">Create Your Healthcare Workspace</h2>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Start managing prescriptions intelligently in under 60 seconds.</p>
              </div>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center relative z-10 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                    <span className="material-symbols-outlined text-[40px]">check_circle</span>
                  </div>
                  <h3 className="text-xl font-semibold text-on-surface dark:text-white mb-2">Workspace Created!</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400 max-w-[280px]">
                    Welcome, {fullName}. We are redirecting you to your prescription workspace dashboard...
                  </p>
                </div>
              ) : (
                <form className="flex flex-col gap-md relative z-10" onSubmit={handleSubmit}>
                  
                  {/* Full Name */}
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 z-10">person</span>
                    <input 
                      className="float-label-input w-full pl-[48px] pr-sm py-3 rounded-xl bg-white/50 dark:bg-slate-950/50 border border-outline-variant/50 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-body-md text-on-surface dark:text-white peer placeholder-transparent" 
                      id="fullName" 
                      placeholder="Full Name" 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    <label className="float-label absolute left-[48px] top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 font-body-md transition-all duration-200 pointer-events-none peer-focus:text-primary" htmlFor="fullName">Full Name</label>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 z-10">mail</span>
                    <input 
                      className="float-label-input w-full pl-[48px] pr-sm py-3 rounded-xl bg-white/50 dark:bg-slate-950/50 border border-outline-variant/50 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-body-md text-on-surface dark:text-white peer placeholder-transparent" 
                      id="email" 
                      placeholder="Email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label className="float-label absolute left-[48px] top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 font-body-md transition-all duration-200 pointer-events-none peer-focus:text-primary" htmlFor="email">Work Email</label>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 z-10">lock</span>
                    <input 
                      className="float-label-input w-full pl-[48px] pr-[48px] py-3 rounded-xl bg-white/50 dark:bg-slate-950/50 border border-outline-variant/50 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-body-md text-on-surface dark:text-white peer placeholder-transparent" 
                      id="password" 
                      placeholder="Password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <label className="float-label absolute left-[48px] top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 font-body-md transition-all duration-200 pointer-events-none peer-focus:text-primary" htmlFor="password">Password</label>
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 hover:text-on-surface dark:hover:text-white transition-colors focus:outline-none z-10" 
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3 mt-2">
                    <input 
                      className="mt-1 w-4 h-4 rounded border-outline-variant/50 text-primary focus:ring-primary/20 bg-white/50 cursor-pointer" 
                      id="terms" 
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      required
                    />
                    <label className="font-body-md text-[13px] text-on-surface-variant dark:text-slate-400 leading-relaxed cursor-pointer" htmlFor="terms">
                      I agree to the <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a> and <a className="text-primary hover:underline font-medium" href="#">Privacy Policy</a>.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button 
                    className="w-full mt-2 py-3.5 px-lg rounded-xl bg-gradient-btn text-white font-label-md text-[16px] font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(0,85,201,0.4)] flex justify-center items-center gap-xs relative overflow-hidden group cursor-pointer" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-shimmer skew-x-12"></div>
                    <span>{isSubmitting ? 'Creating Workspace...' : 'Create Healthcare Workspace'}</span>
                    {!isSubmitting && <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center gap-sm my-4 relative z-10">
                <div className="h-px bg-outline-variant/30 dark:bg-slate-800 flex-grow"></div>
                <span className="font-label-sm text-[12px] text-outline-variant dark:text-slate-500 uppercase tracking-widest">Or connect with</span>
                <div className="h-px bg-outline-variant/30 dark:bg-slate-800 flex-grow"></div>
              </div>

              {/* OAuth Button */}
              <button 
                className="w-full py-3 px-lg rounded-xl bg-white/80 dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-850 text-on-surface dark:text-slate-200 font-label-md text-label-md transition-all duration-200 flex justify-center items-center gap-3 shadow-sm hover:shadow-md relative z-10 cursor-pointer" 
                type="button"
                onClick={() => alert('Social integration simulation: Signed in via Google.')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google Workspace
              </button>

              {/* Benefits List */}
              <div className="flex justify-center gap-4 mt-4 relative z-10">
                <div className="flex items-center gap-1 text-on-surface-variant dark:text-slate-400">
                  <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                  <span className="font-label-sm text-[11px]">Free Account</span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant dark:text-slate-400">
                  <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                  <span className="font-label-sm text-[11px]">No Credit Card</span>
                </div>
              </div>

              {/* Bottom Link */}
              <p className="text-center font-body-md text-[14px] text-on-surface-variant dark:text-slate-400 mt-md relative z-10">
                Already have an account? <a className="font-label-md text-primary dark:text-indigo-400 hover:text-primary-fixed-variant hover:underline transition-colors font-semibold" href="#">Sign In</a>
              </p>

              {/* Trusted Healthcare AI Security Block */}
              <div className="mt-lg pt-md border-t border-outline-variant/30 dark:border-slate-800 relative z-10">
                <p className="text-center font-label-sm text-[11px] text-on-surface-variant dark:text-slate-500 uppercase tracking-wider mb-3">Trusted Healthcare AI</p>
                <div className="flex justify-center gap-md opacity-80">
                  <div className="flex items-center gap-[6px] text-on-surface dark:text-slate-300">
                    <div className="w-6 h-6 rounded bg-surface-container-highest dark:bg-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">health_and_safety</span>
                    </div>
                    <span className="font-label-sm text-[11px] font-medium">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-[6px] text-on-surface dark:text-slate-300">
                    <div className="w-6 h-6 rounded bg-surface-container-highest dark:bg-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                    </div>
                    <span className="font-label-sm text-[11px] font-medium">256-bit Encryption</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
