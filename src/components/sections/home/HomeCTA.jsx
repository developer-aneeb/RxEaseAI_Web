import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { fadeInUp } from '../../../animations/variants';

export default function HomeCTA() {
  return (
    <section className="py-24 relative overflow-hidden transition-all duration-300">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-tertiary opacity-90 z-0"></div>
      <div className="absolute inset-0 grid-bg opacity-20 z-0 mix-blend-overlay"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-sm leading-tight max-w-3xl mx-auto">
            Start Managing Prescriptions Intelligently
          </h2>

          {/* Subtitle */}
          <p className="text-slate-200 text-lg font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Join modern healthcare facilities reducing errors and saving hours of administrative work every week.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              variant="custom"
              size="none"
              className="bg-white hover:bg-slate-100 text-primary font-bold px-8 py-4 rounded-xl shadow-lg transition-all cursor-pointer w-full sm:w-auto"
              onClick={() => window.location.hash = '#signup'}
            >
              Request Early Access
            </Button>
            <Button
              variant="custom"
              size="none"
              className="bg-transparent border border-white/40 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
              onClick={() => window.location.hash = '#signin'}
            >
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
