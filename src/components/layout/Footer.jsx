import { Activity } from 'lucide-react';
import Button from '../ui/Button';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 pb-8 relative overflow-hidden transition-colors duration-300">
      
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Logo & Info (5 cols) */}
          <div className="md:col-span-5 text-left space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                RxEase<span className="text-indigo-500">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-650 dark:text-slate-400 max-w-sm font-light leading-relaxed">
              Automating clinical prescription ingestion with cutting-edge OCR line segmentation and dosage verification systems.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-lg bg-slate-205 dark:bg-slate-900 hover:bg-indigo-600 text-slate-500 dark:text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-slate-205 dark:bg-slate-900 hover:bg-indigo-600 text-slate-500 dark:text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="w-8 h-8 rounded-lg bg-slate-205 dark:bg-slate-900 hover:bg-indigo-600 text-slate-500 dark:text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 text-left space-y-3">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Product</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Features</a></li>
              <li><a href="#workflow" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Pipeline Workflow</a></li>
              <li><a href="#dashboard" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Control Panel</a></li>
              <li><a href="#analytics" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Analytics Stats</a></li>
            </ul>
          </div>

          {/* Newsletter / Updates (4 cols) */}
          <div className="md:col-span-4 text-left space-y-4">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Get Product Updates</h4>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-light">
              Receive the latest news about security features, compliance updates, and API versions.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="doctor@hospital.com"
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-355 focus:outline-none focus:border-indigo-500/60 transition-colors duration-300 font-sans"
              />
              <Button variant="accent" size="sm" className="px-4!">
                Join
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom copyright & status */}
        <div className="border-t border-slate-200 dark:border-slate-900/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} RxEaseAI Inc. All rights reserved.
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-650 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-900/40 border border-slate-250 dark:border-slate-900 px-3 py-1 rounded-full transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </div>
        </div>

      </div>
    </footer>
  );
}