import { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ResetPassword() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`reset-password-page min-h-screen overflow-x-hidden font-body-md antialiased flex flex-col bg-surface text-on-surface dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300`}>
      <style>{`
        .reset-password-page .glass-panel {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        .dark .reset-password-page .glass-panel {
            background: rgba(15, 23, 42, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }
        .reset-password-page .bg-grid-pattern {
            background-image: 
                linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        .dark .reset-password-page .bg-grid-pattern {
            background-image: 
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        }
        .reset-password-page .ambient-glow-primary {
            background: radial-gradient(circle, rgba(0, 85, 201, 0.15) 0%, rgba(255,255,255,0) 70%);
        }
        .reset-password-page .ambient-glow-tertiary {
            background: radial-gradient(circle, rgba(107, 56, 212, 0.1) 0%, rgba(255,255,255,0) 70%);
        }
        .reset-password-page .ambient-glow-secondary {
            background: radial-gradient(circle, rgba(0, 109, 62, 0.1) 0%, rgba(255,255,255,0) 70%);
        }

        
        /* Animations */
        @keyframes customPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
        .animate-pulse-slow {
            animation: customPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes floatAnim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float {
            animation: floatAnim 6s ease-in-out infinite;
        }
        .animate-float-delayed {
            animation: floatAnim 6s ease-in-out 2s infinite;
        }
        @keyframes glowAnim {
            0% { box-shadow: 0 0 10px rgba(0, 85, 201, 0.2); }
            100% { box-shadow: 0 0 20px rgba(0, 85, 201, 0.6); }
        }
        .animate-glow {
            animation: glowAnim 3s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Floating Theme Toggle and Navigation */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        <a
          href="#signin"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </a>
        <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            animate={true}
            aria-label="Toggle Theme"
            className="p-2.5! bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md"
        >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      {/* Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-50 dark:opacity-20"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ambient-glow-primary rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] ambient-glow-tertiary rounded-full animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] ambient-glow-secondary rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col md:flex-row relative z-10 w-full max-w-[1440px] mx-auto min-h-screen items-stretch">
        
        {/* Left Side: Storytelling (45%) */}
        <section className="hidden md:flex md:w-[45%] lg:w-[45%] flex-col p-16 border-r border-outline-variant/30 dark:border-slate-800/60 bg-surface/50 dark:bg-slate-950/50 backdrop-blur-sm overflow-y-auto">
          <div className="animate-slide-up max-w-lg flex flex-col justify-center flex-1">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high/80 dark:bg-slate-800/80 border border-white dark:border-slate-700 backdrop-blur-md mb-10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-label-sm tracking-wider text-on-surface dark:text-slate-200 uppercase">SECURE PASSWORD RECOVERY</span>
            </div>
            
            {/* Headlines */}
            <h1 className="font-display-lg text-display-lg text-on-surface dark:text-white mb-6">
              Create Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">New Password</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-slate-400 mb-16 leading-relaxed">
              You're almost back. Create a strong password to secure your healthcare workspace and continue managing prescriptions, medicine verification, recommendations, reminders, and analytics.
            </p>
            
            {/* Process Flow */}
            <div className="mb-16">
              <div className="flex items-center w-full text-on-surface-variant/50 dark:text-slate-500 font-label-sm text-[11px] mb-2 gap-1">
                <span className="flex-1 text-center leading-tight">Recovery Link</span>
                <span className="flex-1 text-center leading-tight">Identity Verified</span>
                <span className="flex-1 text-center leading-tight text-primary dark:text-blue-400">Create Password</span>
                <span className="flex-1 text-center leading-tight">Workspace Restored</span>
              </div>
              <div className="h-1 bg-surface-container-high dark:bg-slate-800 rounded-full overflow-hidden flex relative">
                <div className="w-1/4 h-full bg-secondary"></div>
                <div className="w-1/4 h-full bg-secondary"></div>
                <div className="w-1/4 h-full bg-gradient-to-r from-secondary to-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/30 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="w-1/4 h-full bg-transparent"></div>
              </div>
            </div>
            
            {/* Floating Feature Cards */}
            <div className="flex flex-col gap-4 relative">
              <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 animate-float max-w-sm">
                <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-slate-800 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-base font-semibold text-on-surface dark:text-slate-200 mb-1">Advanced Account Security</h3>
                  <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400">Multi-layered protection protocols.</p>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 animate-float-delayed max-w-sm ml-10 border-primary/20 shadow-[0_4px_20px_rgba(0,85,201,0.05)] dark:shadow-[0_4px_20px_rgba(0,85,201,0.1)]">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-base font-semibold text-on-surface dark:text-slate-200 mb-1">HIPAA-Compliant Protection</h3>
                  <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400">Clinical grade data encryption.</p>
                </div>
              </div>
            </div>
            
            </div>
            
          </div>
          
          {/* Bottom Metrics */}
          <div className="mt-auto pt-10 mt-10 border-t border-outline-variant/30 dark:border-slate-800/60 flex justify-between items-center shrink-0 w-full animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="text-center">
              <div className="font-headline-md text-lg font-bold text-on-surface dark:text-slate-200">256-bit</div>
              <div className="font-label-sm text-xs text-on-surface-variant dark:text-slate-400 uppercase mt-1">Encryption</div>
            </div>
            <div className="text-center">
              <div className="font-headline-md text-lg font-bold text-on-surface dark:text-slate-200">HIPAA</div>
              <div className="font-label-sm text-xs text-on-surface-variant dark:text-slate-400 uppercase mt-1">Ready</div>
            </div>
            <div className="text-center">
              <div className="font-headline-md text-lg font-bold text-on-surface dark:text-slate-200">99.98%</div>
              <div className="font-label-sm text-xs text-on-surface-variant dark:text-slate-400 uppercase mt-1">Uptime</div>
            </div>
          </div>
        </section>
        
        {/* Right Side: Auth Card (55%) */}
        <section className="w-full md:w-[55%] flex items-center justify-center p-6 md:p-16 h-full relative my-auto">
          <div className="glass-panel rounded-3xl p-10 w-full max-w-md animate-slide-up relative overflow-hidden" style={{animationDelay: '0.2s'}}>
            
            {/* Decorative top edge glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-tertiary to-primary"></div>
            
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface to-surface-container-high dark:from-slate-800 dark:to-slate-700 mx-auto mb-6 flex items-center justify-center shadow-sm border border-white dark:border-slate-600 animate-glow">
                <span className="material-symbols-outlined text-primary dark:text-blue-400" style={{fontSize: '32px', fontVariationSettings: "'FILL' 0"}}>lock_reset</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface dark:text-white mb-4">Reset Password</h2>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-400">Create a strong password to secure your RxEaseAI workspace.</p>
            </div>
            
            {/* Form */}
            <form className="space-y-6">
              {/* Password Field */}
              <div>
                <div className="relative">
                  <input className="float-label-input w-full pl-4 pr-12 py-3 h-14 rounded-xl bg-surface/50 dark:bg-slate-950/50 border border-outline-variant/50 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-body-md text-on-surface dark:text-white peer placeholder-transparent" id="new-password" placeholder="New Password" type="password"/>
                  <label className="float-label absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 font-body-md transition-all duration-200 pointer-events-none peer-focus:text-primary" htmlFor="new-password">New Password</label>
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors focus:outline-none z-10" type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                  </button>
                </div>
                
                {/* Strength Meter */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label-sm text-xs text-on-surface-variant dark:text-slate-400">Password Strength</span>
                    <span className="font-label-sm text-xs text-primary dark:text-blue-400 font-semibold">Medium</span>
                  </div>
                  <div className="flex gap-1 h-1.5">
                    <div className="h-full flex-1 rounded-full bg-secondary"></div>
                    <div className="h-full flex-1 rounded-full bg-secondary"></div>
                    <div className="h-full flex-1 rounded-full bg-surface-container-high dark:bg-slate-700"></div>
                    <div className="h-full flex-1 rounded-full bg-surface-container-high dark:bg-slate-700"></div>
                  </div>
                </div>
                
                {/* Requirements Checklist */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 font-label-md text-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    8+ characters
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 font-label-md text-xs">
                    <span className="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
                    Uppercase letter
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 font-label-md text-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                    Lowercase letter
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400 font-label-md text-xs">
                    <span className="material-symbols-outlined text-[16px]">radio_button_unchecked</span>
                    Number or symbol
                  </div>
                </div>
              </div>
              
              {/* Confirm Password Field */}
              <div className="relative">
                <input className="float-label-input w-full pl-4 pr-12 py-3 h-14 rounded-xl bg-surface/50 dark:bg-slate-950/50 border border-outline-variant/50 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-body-md text-on-surface dark:text-white peer placeholder-transparent" id="confirm-password" placeholder="Confirm Password" type="password"/>
                <label className="float-label absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant dark:text-slate-500 font-body-md transition-all duration-200 pointer-events-none peer-focus:text-primary" htmlFor="confirm-password">Confirm Password</label>
              </div>
              
              {/* Action Button */}
              <button className="w-full h-14 rounded-xl bg-primary text-white font-label-md text-base font-semibold hover:bg-primary-container transition-all duration-300 transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(0,85,201,0.3)] hover:shadow-[0_6px_20px_rgba(0,85,201,0.4)] flex items-center justify-center gap-2 group mt-10" type="button" onClick={() => window.location.hash = '#signin'}>
                Update Password
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
            
            {/* Secondary Actions */}
            <div className="mt-10 flex flex-col items-center gap-3">
              <a className="font-label-md text-sm text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors flex items-center gap-1" href="#signin">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back To Sign In
              </a>
              <a className="font-label-md text-xs text-outline dark:text-slate-500 hover:text-on-surface dark:hover:text-slate-300 transition-colors underline decoration-outline/30 underline-offset-4" href="#">
                Need Help? Contact Support
              </a>
            </div>
            
            {/* Mobile Trust Badges (Hidden on MD+) */}
            <div className="mt-16 pt-10 border-t border-outline-variant/30 dark:border-slate-700 flex md:hidden flex-wrap justify-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1 text-on-surface-variant dark:text-slate-400 font-label-sm text-[10px] uppercase tracking-wide">
                <span className="material-symbols-outlined text-[14px]">lock</span> Encryption
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant dark:text-slate-400 font-label-sm text-[10px] uppercase tracking-wide">
                <span className="material-symbols-outlined text-[14px]">shield</span> HIPAA
              </div>
            </div>
          </div>
          
          {/* System Status Mini Widget */}
          <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container-lowest/80 dark:bg-slate-900/80 backdrop-blur-md border border-outline-variant/20 dark:border-slate-800 shadow-sm animate-slide-up" style={{animationDelay: '0.6s'}}>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-[11px] text-on-surface-variant dark:text-slate-400 tracking-wider uppercase">All Systems Operational | 99.98% Uptime</span>
          </div>
        </section>
        
      </main>
    </div>
  );
}
