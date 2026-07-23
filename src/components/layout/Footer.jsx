import { Activity, ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';

export default function Footer() {
  return (
    <footer className="bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-200/60 dark:border-slate-800 backdrop-blur-xl pt-16 pb-8 relative overflow-hidden transition-colors duration-300">

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Logo & Info (5 cols) */}
          <div className="md:col-span-5 text-left space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                RxEase<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
              Automating clinical prescription ingestion with cutting-edge OCR line segmentation, dosage verification, and therapeutic recommendation systems.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HIPAA Compliant Platform</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 text-left space-y-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><a href="/upload" className="text-slate-500 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Upload Prescription</a></li>
              <li><a href="/history" className="text-slate-500 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Patient History</a></li>
              <li><a href="/search" className="text-slate-500 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Drug Interactions</a></li>
              <li><a href="/settings" className="text-slate-500 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Account Settings</a></li>
            </ul>
          </div>

          {/* Newsletter / Updates (4 cols) */}
          <div className="md:col-span-4 text-left space-y-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Clinical Updates</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Receive the latest news about OCR model improvements, security features, and compliance updates.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="doctor@hospital.com"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-semibold"
                />
              </div>
              <Button variant="primary" className="px-5 py-2.5 rounded-xl font-bold cursor-pointer shrink-0">
                Join
              </Button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 pt-4">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary text-slate-400 flex items-center justify-center transition-all shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary text-slate-400 flex items-center justify-center transition-all shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary text-slate-400 flex items-center justify-center transition-all shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & status */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-semibold text-slate-500">
            &copy; {new Date().getFullYear()} RxEaseAI Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            All Systems Operational
          </div>
        </div>

      </div>
    </footer>
  );
}
