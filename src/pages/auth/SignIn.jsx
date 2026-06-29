import { useState, useEffect } from 'react';
import { Activity, Sun, Moon, ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button';
import PasswordStrengthPanel from '../../components/PasswordStrengthPanel';
import MaterialIcon from '../../components/ui/MaterialIcon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '../../utils/validation/zodSchemas';
import { authService } from '../../services/authService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

export default function SignIn() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  // Form State via React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const login = useAuthStore((state) => state.login);
  const showToast = useAppStore((state) => state.showToast);

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Stats Counter State
  const [prescriptions, setPrescriptions] = useState(0);
  const [verifications, setVerifications] = useState(0);
  const [reminders, setReminders] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Check for errors from OAuth redirect
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const searchParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
      const errorMsg = searchParams.get('error');
      if (errorMsg) {
        showToast(getFriendlyErrorMessage(errorMsg), 'error');
        // Clean up the URL to prevent showing toast again on reload
        window.location.hash = '#signin';
      }
    }

    // Accuracy count up to 74
    let currentAcc = 0;
    const accInterval = setInterval(() => {
      currentAcc += 2.3;
      if (currentAcc >= 74) {
        setAccuracy(74);
        clearInterval(accInterval);
      } else {
        setAccuracy(parseFloat(currentAcc.toFixed(1)));
      }
    }, 20);

    // Prescriptions count up to 12
    let currentPres = 0;
    const presInterval = setInterval(() => {
      currentPres += 1;
      if (currentPres >= 12) {
        setPrescriptions(12);
        clearInterval(presInterval);
      } else {
        setPrescriptions(currentPres);
      }
    }, 40);

    // Verifications count up to 97
    let currentVer = 0;
    const verInterval = setInterval(() => {
      currentVer += 3;
      if (currentVer >= 97) {
        setVerifications(97);
        clearInterval(verInterval);
      } else {
        setVerifications(currentVer);
      }
    }, 20);

    // Reminders count up to 8
    let currentRem = 0;
    const remInterval = setInterval(() => {
      currentRem += 1;
      if (currentRem >= 8) {
        setReminders(8);
        clearInterval(remInterval);
      } else {
        setReminders(currentRem);
      }
    }, 50);

    return () => {
      clearInterval(accInterval);
      clearInterval(presInterval);
      clearInterval(verInterval);
      clearInterval(remInterval);
    };
  }, [showToast]);

  const onSubmit = async (data) => {
    try {
      const response = await authService.login(data.email, data.password);
      showToast('Successfully signed in!', 'success');
      setIsSuccess(true);

      const { user: userData, session } = response.data;
      setTimeout(() => {
        login(userData, session.access_token, session.refresh_token);
      }, 1500);
    } catch (error) {
      console.error('Sign in failed:', error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Invalid email or password.');
      showToast(friendlyMsg, 'error');

      // If email is not verified, redirect to verify-email page
      const errMsg = error.response?.data?.message || '';
      if (errMsg.toLowerCase().includes('verify') || errMsg.toLowerCase().includes('confirmed')) {
        localStorage.setItem('rxease_registered_email', data.email);
        setTimeout(() => {
          window.location.hash = '#verify-email';
        }, 2000);
      }
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-geist antialiased relative overflow-x-hidden dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">

      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 dark:bg-secondary/5 blur-[120px] pointer-events-none"></div>

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
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-stitch-lg xl:p-stitch-xl w-full max-w-container-max mx-auto relative z-10">
        <div className="w-full flex flex-col lg:flex-row gap-stitch-lg md:gap-stitch-xl xl:gap-[80px] items-stretch">

          {/* Left Panel: Value Proposition & Storytelling (55%) */}
          <div className="flex-1 lg:w-[55%] flex flex-col justify-center space-y-stitch-lg order-2 lg:order-1 pt-stitch-xl lg:pt-0">
            <div className="space-y-md animate-fade-in-up">
              <div className="inline-flex items-center gap-stitch-xs px-stitch-sm py-stitch-xs rounded-full glass-panel border border-primary/20 text-primary dark:border-primary/30 relative">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-ring mr-1"></div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">AI-Powered Prescription Intelligence</span>
              </div>
              <h1 className="font-display-lg text-[36px] md:text-5xl font-semibold text-on-surface dark:text-white leading-tight">
                Welcome Back to <br />
                <span className="text-gradient font-bold">RxEaseAI</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-slate-350 max-w-[540px]">
                Continue processing prescriptions, verifying medicines, generating recommendations, managing reminders, and analyzing healthcare data.
              </p>
            </div>

            {/* Float Badge/Cards Section */}
            <div className="relative h-48 mb-12 w-full max-w-lg hidden md:block">
              {/* Card 1 */}
              <div className="absolute top-0 left-0 glass-panel p-3 rounded-lg flex items-center gap-3 shadow-lg animate-float border border-secondary/20 bg-surface/5 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-slate-800 flex items-center justify-center text-primary dark:text-blue-400">
                  <MaterialIcon name="speed" size="xl" />
                </div>
                <div>
                  <span className="text-label-sm font-label-sm text-on-surface dark:text-white block font-medium">Prescription Verified</span>
                  <span className="text-[10px] text-on-surface-variant dark:text-slate-400">74% Confidence</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-16 right-0 glass-panel p-3 rounded-lg flex items-center gap-3 shadow-lg animate-float-delayed border border-primary/20 bg-surface/5 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-blue-400">
                  <MaterialIcon name="verified_user" size="xl" />
                </div>
                <div>
                  <span className="text-label-sm font-label-sm text-on-surface dark:text-white block font-medium">Alternative Medicine Found</span>
                  <span className="text-[10px] text-on-surface-variant dark:text-slate-400">Save 27%</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="absolute bottom-0 left-8 glass-panel p-3 rounded-lg flex items-center gap-3 shadow-lg animate-float-slow border border-tertiary/20 bg-surface/5 backdrop-blur-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface to-surface-container-high dark:from-slate-800 dark:to-slate-700 mx-auto mb-6 flex items-center justify-center shadow-sm border border-white dark:border-slate-600 animate-glow">
                  <MaterialIcon name="health_and_safety" className="text-primary dark:text-blue-400 text-[32px] font-variation-fill" />
                </div>
                <div>
                  <span className="text-label-sm font-label-sm text-on-surface dark:text-white block font-medium">Reminder Scheduled</span>
                  <span className="text-[10px] text-on-surface-variant dark:text-slate-400">8:00 PM Tonight</span>
                </div>
              </div>
            </div>

            {/* Analytics Widget & AI Pipeline Container */}
            <div className="flex flex-col gap-6 max-w-lg">
              {/* Analytics Widget */}
              <div className="glass-panel rounded-xl p-5 border border-outline-variant/30 dark:border-slate-800 relative overflow-hidden">
                <div className="grid grid-cols-4 gap-4 divide-x divide-outline-variant/30 dark:divide-slate-800">
                  <div className="flex flex-col gap-1 px-2">
                    <span className="text-[28px] font-bold text-on-surface dark:text-white font-headline-lg">{prescriptions}</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Prescriptions</span>
                  </div>
                  <div className="flex flex-col gap-1 px-4">
                    <span className="text-[28px] font-bold text-primary dark:text-indigo-400 font-headline-lg">{verifications}</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Verifications</span>
                  </div>
                  <div className="flex flex-col gap-1 px-4">
                    <span className="text-[28px] font-bold text-secondary dark:text-emerald-400 font-headline-lg">{reminders}</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Reminders</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-4">
                    <span className="text-[28px] font-bold text-tertiary dark:text-purple-400 font-headline-lg">{accuracy}%</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Accuracy</span>
                  </div>
                </div>
              </div>

              {/* Minimalist AI Pipeline */}
              <div className="flex items-center justify-between px-2 text-on-surface-variant dark:text-slate-400 select-none">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-sm">upload</span>
                  <span className="text-[10px] font-medium">Upload</span>
                </div>
                <div className="flex-grow h-[1px] bg-outline-variant/30 dark:bg-slate-800 mx-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-flow"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary dark:text-indigo-400">view_in_ar</span>
                  <span className="text-[10px] font-medium">YOLO</span>
                </div>
                <div className="flex-grow h-[1px] bg-outline-variant/30 dark:bg-slate-800 mx-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-flow" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-sm">document_scanner</span>
                  <span className="text-[10px] font-medium">OCR</span>
                </div>
                <div className="flex-grow h-[1px] bg-outline-variant/30 dark:bg-slate-800 mx-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-tertiary to-transparent opacity-50 animate-flow" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary dark:text-emerald-400">verified_user</span>
                  <span className="text-[10px] font-medium">Verify</span>
                </div>
                <div className="flex-grow h-[1px] bg-outline-variant/30 dark:bg-slate-800 mx-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50 animate-flow" style={{ animationDelay: '1.5s' }}></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-tertiary dark:text-purple-400">auto_awesome</span>
                  <span className="text-[10px] font-medium">Recommend</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Sign In Form (45%) */}
          <div className="flex-1 lg:w-[45%] w-full max-w-[500px] mx-auto order-1 lg:order-2 animate-fade-in-up delay-400">
            <div className="glass-panel dark:bg-slate-900/60 dark:border-slate-800/80 rounded-2xl p-stitch-lg flex flex-col gap-stitch-md ai-glow relative overflow-hidden border-t border-l border-white/60 dark:border-white/10">

              {/* Decorative top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="text-center mb-stitch-sm relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/25 to-tertiary/25 border border-primary/30 mb-5 shadow-[0_0_20px_rgba(0,85,201,0.2)]">
                  <span className="material-symbols-outlined text-3xl text-primary">health_and_safety</span>
                </div>
                <h2 className="font-headline-md text-[26px] text-on-surface dark:text-white font-semibold mb-2">Sign In</h2>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Secure access to your intelligent healthcare workspace.</p>
              </div>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center relative z-10 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-on-surface dark:text-white mb-2">Welcome Back!</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400 max-w-[280px]">
                    Successfully authenticated. We are redirecting you to your workspace...
                  </p>
                </div>
              ) : (
                <form className="flex flex-col gap-stitch-md relative z-10" onSubmit={handleSubmit(onSubmit)}>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 z-10 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      className={`peer w-full pl-11 pr-4 py-4 rounded-xl border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-outline-variant dark:border-slate-800'} bg-surface/50 dark:bg-slate-900/50 focus:bg-surface dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface dark:text-white placeholder-transparent`}
                      {...register('email')}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-11 -top-2.5 px-1 bg-surface dark:bg-slate-900 text-xs font-medium text-on-surface-variant dark:text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary pointer-events-none"
                    >
                      Email Address
                    </label>
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>}

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 z-10 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`peer w-full pl-11 pr-12 py-4 rounded-xl border ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-outline-variant dark:border-slate-800'} bg-surface/50 dark:bg-slate-900/50 focus:bg-surface dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface dark:text-white placeholder-transparent`}
                      {...register('password')}
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-11 -top-2.5 px-1 bg-surface dark:bg-slate-900 text-xs font-medium text-on-surface-variant dark:text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary pointer-events-none"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>}
                  <PasswordStrengthPanel password={watch('password') || ''} />

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <input
                        className="w-4 h-4 rounded border-outline-variant/50 text-primary focus:ring-primary/20 bg-white/50 cursor-pointer"
                        id="rememberMe"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="font-body-md text-[13px] text-on-surface-variant dark:text-slate-400 leading-none cursor-pointer select-none" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a className="text-[13px] font-semibold text-primary dark:text-indigo-450 hover:underline transition-colors" href="#forgot-password">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit CTA */}
                  <Button
                    variant="custom"
                    size="none"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 px-stitch-lg rounded-xl bg-gradient-btn text-white font-label-md text-[16px] font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(0,85,201,0.4)] flex justify-center items-center gap-stitch-xs relative overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-shimmer skew-x-12"></div>
                    {isSubmitting ? 'Accessing Workspace...' : 'Access Workspace'}
                    {!isSubmitting && <MaterialIcon name="arrow_forward" size="xl" className="group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>
              )}

              {/* Or Divider */}
              <div className="flex items-center gap-stitch-sm my-3 relative z-10">
                <div className="h-px bg-outline-variant/30 dark:bg-slate-800 flex-grow"></div>
                <span className="font-label-sm text-[11px] text-outline-variant dark:text-slate-500 uppercase tracking-widest">Or continue with</span>
                <div className="h-px bg-outline-variant/30 dark:bg-slate-800 flex-grow"></div>
              </div>

              {/* OAuth Google button */}
              <button
                className="w-full py-3 px-stitch-lg rounded-xl bg-white/80 dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-850 text-on-surface dark:text-slate-200 font-label-md text-label-md transition-all duration-200 flex justify-center items-center gap-3 shadow-sm hover:shadow-md relative z-10 cursor-pointer"
                type="button"
                onClick={async () => {
                  try {
                    await authService.initiateGoogleOAuth();
                  } catch (error) {
                    showToast(getFriendlyErrorMessage(error), 'error');
                  }
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>

              {/* Bottom Navigation Redirect */}
              <p className="text-center font-body-md text-[14px] text-on-surface-variant dark:text-slate-400 mt-2 relative z-10">
                Don't have an account? <a className="font-label-md text-primary dark:text-indigo-400 hover:underline transition-colors font-semibold" href="#signup">Create Account</a>
              </p>

              {/* Trusted Security block */}
              <div className="mt-4 pt-4 border-t border-outline-variant/30 dark:border-slate-800 relative z-10">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="flex flex-col items-center text-center gap-1 text-on-surface-variant dark:text-slate-500 hover:text-primary dark:hover:text-indigo-400 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
                    <span className="text-[10px] leading-tight font-medium">Encrypted Auth</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 text-on-surface-variant dark:text-slate-500 hover:text-primary dark:hover:text-indigo-400 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">policy</span>
                    <span className="text-[10px] leading-tight font-medium">HIPAA Ready</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 text-on-surface-variant dark:text-slate-500 hover:text-primary dark:hover:text-indigo-400 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                    <span className="text-[10px] leading-tight font-medium">Fast Access</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1 text-on-surface-variant dark:text-slate-500 hover:text-primary dark:hover:text-indigo-400 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">gpp_good</span>
                    <span className="text-[10px] leading-tight font-medium">Data Protected</span>
                  </div>
                </div>

                {/* Uptime Status Bar */}
                <div className="flex items-center justify-center gap-2 bg-white/40 dark:bg-white/5 py-2 rounded-lg border border-outline-variant/20 dark:border-white/5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span className="text-[11px] font-medium text-on-surface-variant dark:text-slate-400">All Systems Operational <span className="mx-1 text-outline-variant/30">|</span> 99.98% Uptime</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
