import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { staggerContainer, fadeInUp, scaleIn } from '../../animations/variants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import MaterialIcon from '../ui/MaterialIcon';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* Background glow spots */}
      <div className="glow-spot top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
      <div className="glow-spot bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 pointer-events-none transition-colors duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left Content */}
          <motion.div
            className="lg:col-span-7 text-left flex flex-col gap-6"
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            animate="visible"
          >
            {/* Tagline */}
            <motion.div variants={fadeInUp(20)}>
              <Badge 
                variant="primary" 
                icon={Sparkles} 
                className="text-xs px-3 py-1.5 bg-indigo-500/10 font-sans tracking-wide"
              >
                RxEaseAI - AI-powered Prescription Interpretation
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp(25)}
              className="text-4xl sm:text-5xl md:text-[56px] lg:text-[60px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]!"
            >
              Transform Handwritten Prescriptions Into{' '}
              <span className="bg-gradient-to-r from-[#0F6FFF] to-[#1DBF73] bg-clip-text text-transparent font-extrabold">
                Smart AI-Powered Digital Healthcare
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp(25)}
              className="text-base sm:text-lg text-slate-650 dark:text-slate-300 max-w-2xl font-light leading-relaxed"
            >
              Experience unparalleled accuracy with our AI-driven platform. Instantly convert complex medical handwriting into structured, actionable data while ensuring complete clinical compliance.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp(20)}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                href="#workflow"
                variant="primary"
                size="lg"
                icon={ArrowRight}
              >
                Try Interactive Demo
              </Button>
              <Button
                href="#features"
                variant="secondary"
                size="lg"
              >
                Explore Features
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeInUp(15)}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/60 max-w-xl"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                74% Accuracy
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Zap className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                &lt; 2s Processing
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right Visuals with Laser Scan and Hover Reveal */}
          <motion.div
            className="lg:col-span-5 relative"
            variants={scaleIn(0.95, 0.8, 0.3)}
            initial="hidden"
            animate="visible"
          >
            {/* Visual Container */}
            <div className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 transition-all duration-300">

              {/* Device Demo Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  alt="RxEaseAI Dashboard Demo"
                  className="w-full h-full object-cover opacity-90 dark:opacity-80 transition-opacity duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxw4aAf0_mpQwihCl_-uFwDMAOxuNHSQWy2r27TDVaSU1vgancDLhXYXB6Os0oEjGOW_jON5ZFgQfxhxT2V7MYMNypyvqpSGfXI0A2nMitG6B19dj94Wj072mSoETtxh_wfhuqBkiqrG7zGtE9mFmEyeo1qGgjk0XyXYAawdM4CylU4VMhO0wO-dVHTnxTdkxrmkKx3sivB4H3etefCkU2CH-xAHlZCDhDea4w5rwOqrrIhWUM0P5m7h3QbIitXN2s9lrPSQTFVPg"
                />

                {/* Laser line scanning animation */}
                <div className="laser-line"></div>
                <div className="scan-overlay"></div>
              </div>

              {/* Structured Data Hover Revealing overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-end pr-6 gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-slate-950/20 backdrop-filter backdrop-blur-xs pointer-events-none">

                {/* Card 1 */}
                <Card
                  variant="glass"
                  className="p-3.5 pop-card shadow-lg flex items-center gap-3 w-[260px] max-w-full text-left"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#1DBF73]/20 flex items-center justify-center shrink-0">
                    <MaterialIcon name="medication" color="text-[#1DBF73]" size="sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono tracking-wider uppercase">Detected Medication</p>
                    <p className="text-xs text-slate-850 dark:text-slate-200 font-bold mt-0.5">Amoxicillin 500mg</p>
                  </div>
                </Card>

                {/* Card 2 */}
                <Card
                  variant="glass"
                  className="p-3.5 pop-card shadow-lg flex items-center gap-3 w-[260px] max-w-full text-left"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0F6FFF]/20 flex items-center justify-center shrink-0">
                    <MaterialIcon name="schedule" color="text-[#0F6FFF]" size="sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono tracking-wider uppercase">Dosage Instructions</p>
                    <p className="text-xs text-slate-855 dark:text-slate-200 font-bold mt-0.5">1 pill, 3x daily, 7 days</p>
                  </div>
                </Card>

              </div>

            </div>

            {/* floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 glassmorphism p-3.5 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 hidden sm:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <div className="text-[9px] text-slate-400 font-mono font-semibold">LATENCY</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white">1.8 seconds</div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}