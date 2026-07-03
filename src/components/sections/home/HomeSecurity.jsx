import { motion } from 'framer-motion';
import Badge from '../../ui/Badge';
import MaterialIcon from '../../ui/MaterialIcon';
import { fadeInUp, staggerContainer } from '../../../animations/variants';

export default function HomeSecurity() {
  return (
    <section id="security" className="py-24 bg-slate-900 text-white relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Glow Spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Security Content */}
          <motion.div
            className="text-left flex flex-col items-start"
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Tagline Badge */}
            <motion.div variants={fadeInUp(20)}>
              <Badge
                variant="neutral"
                className="bg-white/10 border-white/10 text-emerald-400 uppercase tracking-wider text-xs px-3 py-1.5 mb-6 flex items-center gap-1.5 shadow-sm"
              >
                <MaterialIcon name="shield" size="xs" className="text-emerald-400" />
                <span>Enterprise Grade Security</span>
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={fadeInUp(25)}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight text-white"
            >
              Protected Health Information (PHI), Secured.
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeInUp(25)}
              className="text-slate-300 text-lg font-light leading-relaxed mb-8 max-w-xl"
            >
              We employ zero-knowledge encryption and strict access controls. Your patient data is processed transiently and never stored longer than necessary for verification.
            </motion.p>

            {/* Security Checkpoints */}
            <motion.ul className="space-y-6 w-full" variants={staggerContainer(0.1, 0.2)}>
              <motion.li variants={fadeInUp(15)} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                  <MaterialIcon name="check" className="text-emerald-400" size="sm" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">End-to-End Encryption</h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">AES-256 encryption at rest and TLS 1.3 in transit.</p>
                </div>
              </motion.li>
              <motion.li variants={fadeInUp(15)} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                  <MaterialIcon name="check" className="text-emerald-400" size="sm" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">HIPAA/SOC2 Compliant</h4>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">Audited annually by independent third-party security firms.</p>
                </div>
              </motion.li>
            </motion.ul>
          </motion.div>

          {/* Interactive Rotating Rings Visual */}
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-64 h-64 relative flex items-center justify-center">
              
              {/* Outer Spin Ring */}
              <motion.div 
                className="absolute inset-0 border-4 border-emerald-500/10 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              />

              {/* Inner Reverse Spin Ring */}
              <motion.div 
                className="absolute inset-4 border-4 border-dashed border-indigo-400/20 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
              />

              {/* Central Shield Icon with Glow */}
              <div className="w-32 h-32 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-2xl relative z-10">
                <MaterialIcon 
                  name="shield_locked" 
                  className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]" 
                  style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
