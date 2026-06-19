import { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';

export default function VerifyEmail() {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState(42);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Micro-interaction: Floating particles simulation
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9);
      const size = Math.random() * 8 + 4;
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const translateY = Math.random() * 200 + 50;
      const translateX = Math.random() * 40 - 20;

      setParticles((current) => [...current, { id, size, left, top, translateY, translateX }]);

      setTimeout(() => {
        setParticles((current) => current.filter((p) => p.id !== id));
      }, 5000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen overflow-x-hidden relative dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-tertiary/5 blur-[120px] rounded-full"></div>
        
        {/* Render particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-primary/20 rounded-full pointer-events-none transition-all duration-[5000ms] ease-out opacity-40"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
              transform: `translateY(-${p.translateY}px) translateX(${p.translateX}px)`
            }}
          />
        ))}
      </div>

      <main className="relative z-10 pt-20 flex flex-col md:flex-row min-h-screen">
        {/* Left Side: Informational & Brand Identity (45%) */}
        <section className="w-full md:w-[45%] p-6 flex flex-col justify-center relative overflow-hidden">
          {/* Staggered Entrance Content */}
          <div className="max-w-xl mx-auto md:ml-16 space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 glass-panel rounded-full border border-primary/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2 shrink-0"></span>
              <span className="font-label-sm text-[12px] font-bold text-primary tracking-wider uppercase">ACCOUNT VERIFICATION REQUIRED</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display-lg text-[48px] leading-tight font-semibold text-on-surface dark:text-white">
              Verify Your <br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Email Address</span>
            </h1>
            
            {/* Description */}
            <p className="font-body-lg text-[18px] text-on-surface-variant dark:text-slate-400 max-w-md">
              We have sent a verification link to your email. Verify your account to securely access prescription intelligence and automated clinical workflows.
            </p>
            
            {/* Verification Journey */}
            <div className="relative py-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#006d3e] flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <span className="font-label-md text-[14px] text-on-surface dark:text-white opacity-60 whitespace-nowrap">Create Account</span>
                  <div className="h-[2px] w-full max-w-[200px] bg-[#006d3e]/30 hidden md:block ml-2"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#0055c9] animate-pulse-glow flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <span className="font-label-md text-[14px] text-[#0055c9] font-bold whitespace-nowrap">Email Sent</span>
                  <div className="h-[2px] w-full max-w-[200px] bg-outline-variant/30 dark:bg-slate-700 hidden md:block ml-2"></div>
                </div>
                <div className="flex items-center gap-4 opacity-40">
                  <div className="w-8 h-8 rounded-full bg-outline-variant dark:bg-slate-700 flex items-center justify-center text-on-surface-variant dark:text-slate-400 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                  </div>
                  <span className="font-label-md text-[14px] text-on-surface dark:text-white whitespace-nowrap">Verify Identity</span>
                </div>
              </div>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-6 pt-10">
              <div className="space-y-2">
                <div className="font-headline-md text-[24px] font-bold text-primary">50K+</div>
                <div className="font-label-sm text-[12px] text-on-surface-variant dark:text-slate-400">Prescriptions</div>
              </div>
              <div className="space-y-2">
                <div className="font-headline-md text-[24px] font-bold text-secondary">99.2%</div>
                <div className="font-label-sm text-[12px] text-on-surface-variant dark:text-slate-400">OCR Accuracy</div>
              </div>
              <div className="space-y-2">
                <div className="font-headline-md text-[24px] font-bold text-on-surface dark:text-white">HIPAA</div>
                <div className="font-label-sm text-[12px] text-on-surface-variant dark:text-slate-400">Ready</div>
              </div>
              <div className="space-y-2">
                <div className="font-headline-md text-[24px] font-bold text-on-surface dark:text-white">99.98%</div>
                <div className="font-label-sm text-[12px] text-on-surface-variant dark:text-slate-400">Uptime</div>
              </div>
            </div>
          </div>
          
          {/* Floating Cards Decor */}
          <div className="absolute right-[5%] top-[30%] hidden lg:block pointer-events-none z-20">
            <div className="animate-float" style={{ animationDelay: '0s' }}>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 dark:border-slate-700 mb-6 -translate-x-20">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-primary text-[20px]">send</span></div>
                  <span className="font-label-md text-[13px] font-semibold text-on-surface dark:text-white">Verification Email Sent</span>
                </div>
              </div>
            </div>
            <div className="animate-float" style={{ animationDelay: '1s' }}>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 dark:border-slate-700 mb-6 translate-x-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary/10 rounded-lg"><span className="material-symbols-outlined text-secondary text-[20px]">security</span></div>
                  <span className="font-label-md text-[13px] font-semibold text-on-surface dark:text-white">Identity Protection Enabled</span>
                </div>
              </div>
            </div>
            <div className="animate-float" style={{ animationDelay: '2s' }}>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 dark:border-slate-700 translate-x-12">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-tertiary/10 rounded-lg"><span className="material-symbols-outlined text-tertiary dark:text-purple-400 text-[20px]">pending</span></div>
                  <span className="font-label-md text-[13px] font-semibold text-on-surface dark:text-white">Activation Pending</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Verification Card (55%) */}
        <section className="w-full md:w-[55%] p-6 flex items-center justify-center relative bg-surface-container-low/30 dark:bg-slate-900/30 border-l border-outline-variant/30 dark:border-slate-800">
          {/* System Status Glass Widget */}
          <div className="absolute top-6 right-6">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-4 border border-white/40 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm animate-pulse">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-[12px] font-medium text-on-surface-variant dark:text-slate-400">All Systems Operational</span>
            </div>
          </div>
          
          <div className="w-full max-w-lg animate-fade-in-up duration-700 delay-200">
            {/* Main Glassmorphic Card */}
            <div className="bg-[#cfe2f3]/80 dark:bg-slate-800/80 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/40 dark:border-slate-700 backdrop-blur-xl">
              <div className="flex flex-col items-center text-center space-y-6">
                
                {/* Icon with Glowing Gradient Square */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#0055c9]/20 blur-xl group-hover:bg-[#0055c9]/30 transition-all rounded-full animate-pulse-glow"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#0055c9] to-[#006d3e] rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                    <span className="material-symbols-outlined text-white text-[40px]">mark_email_read</span>
                  </div>
                  {/* Success Pulse */}
                  <div className="absolute -inset-2 border-2 border-[#0055c9]/20 rounded-2xl animate-ping opacity-25"></div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="font-headline-lg text-[32px] font-bold text-on-surface dark:text-white">Check Your Email</h2>
                  <p className="font-body-md text-[16px] text-on-surface-variant dark:text-slate-400">
                    We've sent a verification link to: <br/>
                    <span className="font-semibold text-on-surface dark:text-white underline decoration-primary/30">doctor@hospital.com</span>
                  </p>
                </div>
                
                {/* CTA Section */}
                <div className="w-full pt-6 space-y-4">
                  <button className="w-full py-3.5 bg-gradient-to-r from-[#0055c9] to-[#006d3e] text-white font-label-md text-[16px] font-semibold rounded-xl shadow-xl shadow-[#0055c9]/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Open Email App
                  </button>
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <button 
                      className="font-label-md text-[14px] text-[#0055c9] hover:underline disabled:text-on-surface-variant/40 dark:disabled:text-slate-400 disabled:no-underline font-bold" 
                      disabled={timeLeft > 0} 
                      onClick={() => setTimeLeft(42)}
                    >
                      Resend Verification Email
                    </button>
                    <span className={`font-label-sm text-[12px] ${timeLeft > 0 ? 'text-on-surface-variant dark:text-slate-400 opacity-60' : 'text-[#006d3e] font-semibold'}`}>
                      {timeLeft > 0 ? `Wait ${timeLeft}s before resending` : 'Ready to resend link'}
                    </span>
                  </div>
                </div>
                
                {/* Status Widget */}
                <div className="w-full bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-white/40 dark:border-slate-700 mt-10 shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#006d3e] text-[20px]">check_circle</span>
                        <span className="font-label-md text-[14px] font-bold text-on-surface dark:text-slate-200">Email Sent</span>
                      </div>
                      <span className="font-label-sm text-[12px] font-medium text-on-surface-variant dark:text-slate-400">12:04 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#006d3e] text-[20px]">task_alt</span>
                        <span className="font-label-md text-[14px] font-bold text-on-surface dark:text-slate-200">Delivery Confirmed</span>
                      </div>
                      <span className="font-label-sm text-[12px] font-medium text-on-surface-variant dark:text-slate-400">12:05 PM</span>
                    </div>
                    <div className="flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0055c9] text-[20px]">sync</span>
                        <span className="font-label-md text-[14px] font-bold text-[#0055c9]">Awaiting Verification</span>
                      </div>
                      <span className="font-label-sm text-[12px] text-[#0055c9] font-bold">Live...</span>
                    </div>
                  </div>
                </div>
                
                {/* Auto-detection Card */}
                <div className="w-full glass-panel p-4 rounded-xl border border-primary/10 bg-primary/5 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <span className="font-label-sm text-[12px] font-medium text-on-surface-variant dark:text-slate-400">Automatically detecting verification...</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-primary animate-spin">refresh</span>
                </div>
                
                {/* Action Links */}
                <div className="flex gap-6 pt-6 border-t border-outline-variant/30 dark:border-slate-800 w-full justify-center">
                  <a className="font-label-sm text-[12px] font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors" href="#">Change Email</a>
                  <a className="font-label-sm text-[12px] font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors" href="#signin">Back to Sign In</a>
                  <a className="font-label-sm text-[12px] font-semibold text-on-surface-variant dark:text-slate-400 hover:text-primary transition-colors" href="#">Need Help?</a>
                </div>
              </div>
            </div>
            
            {/* Security Badges Block */}
            <div className="grid grid-cols-4 gap-4 mt-10 px-6">
              <div className="flex flex-col items-center text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-[20px]">verified_user</span>
                <span className="font-label-sm text-[10px] leading-tight text-on-surface-variant dark:text-slate-400">Secure Verification</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-[20px]">medical_services</span>
                <span className="font-label-sm text-[10px] leading-tight text-on-surface-variant dark:text-slate-400">HIPAA Ready</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-[20px]">bolt</span>
                <span className="font-label-sm text-[10px] leading-tight text-on-surface-variant dark:text-slate-400">Fast Activation</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-[20px]">lock</span>
                <span className="font-label-sm text-[10px] leading-tight text-on-surface-variant dark:text-slate-400">Data Protected</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
