import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn } from '../../../animations/variants';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Card from '../../ui/Card';
import MaterialIcon from '../../ui/MaterialIcon';

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-[100px] pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Grid Background Overlay */}
      <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-50 dark:opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:via-slate-950/50 dark:to-slate-950 z-0 pointer-events-none"></div>

      {/* Decorative Glow Spots */}
      <div className="glow-spot top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
      <div className="glow-spot bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Left Content */}
          <motion.div
            className="text-left flex flex-col items-start max-w-2xl animate-fade-in-up"
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            animate="visible"
          >
            {/* Tagline Badge */}
            <motion.div variants={fadeInUp(20)}>
              <Badge
                variant="neutral"
                className="bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-800 text-tertiary dark:text-tertiary-fixed-dim uppercase tracking-wider text-xs px-3 py-1.5 mb-6 flex items-center gap-1.5 shadow-sm cursor-default"
              >
                <MaterialIcon name="auto_awesome" size="xs" className="text-tertiary dark:text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }} />
                <span>New: Advanced OCR Model v2.0</span>
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp(25)}
              className="text-4xl sm:text-5xl md:text-[56px] md:leading-[64px] font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
            >
              Transform Handwritten Prescriptions Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary font-extrabold">
                Smart Digital Healthcare
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp(25)}
              className="text-base sm:text-lg text-slate-650 dark:text-slate-350 mb-8 font-light leading-relaxed"
            >
              AI-powered prescription OCR, medicine verification, and affordable recommendations — built to make healthcare clearer, faster, and smarter.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={fadeInUp(20)}
              className="flex flex-wrap gap-4 w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="lg"
                className="bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto px-6 py-3 rounded-lg"
                onClick={() => window.location.hash = '#signup'}
              >
                <span>Scan Prescription</span>
                <MaterialIcon name="document_scanner" size="sm" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-primary border border-slate-200 dark:border-slate-800 font-semibold flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto px-6 py-3 rounded-lg"
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>View Demo</span>
                <MaterialIcon name="play_circle" size="sm" />
              </Button>
            </motion.div>

            {/* Trust Info */}
            <motion.div
              variants={fadeInUp(15)}
              className="mt-8 flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium text-xs border-t border-slate-200 dark:border-slate-800/80 pt-6 w-full"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-950 flex items-center justify-center shadow-sm">
                  <MaterialIcon name="local_hospital" size="xs" className="text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-950 flex items-center justify-center shadow-sm">
                  <MaterialIcon name="science" size="xs" className="text-tertiary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-950 flex items-center justify-center shadow-sm">
                  <MaterialIcon name="verified_user" size="xs" className="text-emerald-500" />
                </div>
              </div>
              <span>Trusted by 500+ clinics worldwide</span>
            </motion.div>
          </motion.div>

          {/* Hero Right Visuals */}
          <motion.div
            className="relative hidden lg:block"
            variants={scaleIn(0.95, 0.8, 0.3)}
            initial="hidden"
            animate="visible"
          >
            {/* Blurry Background Accents */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl"></div>

            {/* Image Container with slight rotation */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 bg-white dark:bg-slate-900">
              <img
                alt="RxEaseAI Prescription Scanning"
                className="w-full h-auto object-cover opacity-95 dark:opacity-85"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRzGKlD1J_h6E2YZPyt2ZsK_XnYY4AO89Gv437yv7s6dmPM0cdSsserjNr3fDPUQ7GL3URqQmJe7s5Vnf7hi_YYN4syZ5QJ6Omk4VGv2EvgeRtY6Z4B7i60A9D3KwQdYRsIzqWHGC5sNECd9u-uQB1fKPX500okb4Z3AEmQ7tCuJgWy9pk5F7i7PrurKt0K8_XZH23dS4gTg5aWdoSMSGE2E1_ra_2t19qFlzqWgLnK2pKwervGmRyeUW6ap-BF6HEZ14K-79dGCk"
              />

              {/* Floating Verified Badge */}
              <div className="absolute top-6 left-6 glass-panel rounded-xl p-3 flex items-center gap-3 shadow-lg border border-white/50 dark:border-white/5 animate-pulse bg-white/70 dark:bg-slate-950/70">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MaterialIcon name="check_circle" className="text-emerald-500" size="sm" />
                </div>
                <div className="text-left animate-none">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono tracking-wider">AMOXICILLIN 500MG</p>
                  <p className="text-xs text-slate-800 dark:text-white font-bold mt-0.5">Verified Safe</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
