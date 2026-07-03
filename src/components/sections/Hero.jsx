import { motion } from 'framer-motion';
import { Sparkles, PlayCircle, Scan, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { staggerContainer, fadeInUp, scaleIn } from '../../animations/variants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import MaterialIcon from '../ui/MaterialIcon';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Background grid from Stitch */}
      <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-50 dark:opacity-30"></div>
      
      {/* Background glow spots */}
      <div className="glow-spot top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
      <div className="glow-spot bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left Content */}
          <motion.div
            className="lg:col-span-7 text-left flex flex-col gap-6"
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            animate="visible"
          >
            {/* New Model Badge */}
            <motion.div variants={fadeInUp(20)}>
              <Badge 
                variant="primary" 
                icon={Sparkles} 
                className="text-xs px-3.5 py-1.5 bg-indigo-500/10 font-sans tracking-wide uppercase"
              >
                New: Advanced OCR Model v2.0
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp(25)}
              className="text-4xl sm:text-5xl md:text-[56px] lg:text-[60px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]!"
            >
              Transform Handwritten Prescriptions Into{' '}
              <span className="bg-gradient-to-r from-primary via-indigo-650 to-tertiary bg-clip-text text-transparent font-extrabold">
                Smart Digital Healthcare
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp(25)}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-light leading-relaxed"
            >
              AI-powered prescription OCR, medicine verification, and affordable recommendations — built to make healthcare clearer, faster, and smarter.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp(20)}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                href="#how-it-works"
                variant="primary"
                size="lg"
                icon={Scan}
              >
                Scan Prescription
              </Button>
              <Button
                href="#dashboard"
                variant="secondary"
                size="lg"
                icon={PlayCircle}
              >
                View Demo
              </Button>
            </motion.div>

            {/* Trusted by Badges */}
            <motion.div
              variants={fadeInUp(15)}
              className="mt-4 flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs font-semibold"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-primary font-bold">local_hospital</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-tertiary font-bold">science</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-secondary font-bold">verified_user</span>
                </div>
              </div>
              <span>Trusted by 500+ clinics worldwide</span>
            </motion.div>
          </motion.div>

          {/* Hero Right Visuals */}
          <motion.div
            className="lg:col-span-5 relative"
            variants={scaleIn(0.95, 0.8, 0.3)}
            initial="hidden"
            animate="visible"
          >
            {/* Visual Container */}
            <div className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 transition-all duration-300 transform rotate-[-2deg] hover:rotate-0">

              {/* Scan Image from Stitch */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  alt="RxEaseAI Prescription Scanning"
                  className="w-full h-full object-cover opacity-90 dark:opacity-80 transition-opacity duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRzGKlD1J_h6E2YZPyt2ZsK_XnYY4AO89Gv437yv7s6dmPM0cdSsserjNr3fDPUQ7GL3URqQmJe7s5Vnf7hi_YYN4syZ5QJ6Omk4VGv2EvgeRtY6Z4B7i60A9D3KwQdYRsIzqWHGC5sNECd9u-uQB1fKPX500okb4Z3AEmQ7tCuJgWy9pk5F7i7PrurKt0K8_XZH23dS4gTg5aWdoSMSGE2E1_ra_2t19qFlzqWgLnK2pKwervGmRyeUW6ap-BF6HEZ14K-79dGCk"
                />

                {/* Laser line scanning animation */}
                <div className="laser-line"></div>
                <div className="scan-overlay"></div>
              </div>

              {/* Floating UI Element from Stitch */}
              <div className="absolute top-6 left-6 glass-panel rounded-xl p-3.5 flex items-center gap-3 shadow-lg animate-pulse dark:border-slate-850">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase font-semibold">Amoxicillin 500mg</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Verified</p>
                </div>
              </div>

            </div>

            {/* Floating latency badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 glassmorphism p-3.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 hidden sm:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                <Zap className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-[9px] text-slate-400 font-mono font-semibold">LATENCY</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">4m average</div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}