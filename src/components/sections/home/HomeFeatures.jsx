import { motion } from 'framer-motion';
import SectionHeader from '../../ui/SectionHeader';
import Card from '../../ui/Card';
import MaterialIcon from '../../ui/MaterialIcon';
import { fadeInUp, staggerContainer } from '../../../animations/variants';

export default function HomeFeatures() {
  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Clinical Intelligence Core
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-light leading-relaxed">
              Our specialized models are trained on millions of medical documents to ensure high-fidelity data extraction.
            </p>
          </div>
          <button 
            onClick={() => window.location.hash = '#signup'}
            className="mt-6 md:mt-0 text-primary font-semibold text-sm uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
          >
            <span>View Full Capabilities</span>
            <MaterialIcon name="arrow_forward" size="sm" />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Card 1: Medical OCR Engine */}
          <motion.div variants={fadeInUp(25)}>
            <Card 
              variant="glass" 
              hoverEffect={true} 
              className="p-8 h-full flex flex-col justify-between bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <MaterialIcon name="text_snippet" className="text-primary" size="2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Medical OCR Engine
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Deciphers complex physician handwriting with 99.4% accuracy, interpreting abbreviations and medical shorthand.
                </p>
              </div>

              {/* Scanning visual overlay */}
              <div className="bg-slate-100 dark:bg-slate-950/60 h-24 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center px-6">
                  <div className="w-full h-[2px] bg-primary/20 relative">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-primary"
                      animate={{ 
                        left: ['0%', '100%', '0%'],
                        width: ['20%', '50%', '20%']
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        ease: 'easeInOut' 
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest absolute top-2 right-3">OCR Segment Active</span>
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Interaction Verification */}
          <motion.div variants={fadeInUp(25)}>
            <Card 
              variant="glass" 
              hoverEffect={true} 
              className="p-8 h-full flex flex-col justify-between bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800/80"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-6">
                  <MaterialIcon name="health_metrics" className="text-tertiary" size="2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Interaction Verification
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Automatically flags potential contraindications and dosage errors against comprehensive pharmacological databases.
                </p>
              </div>

              {/* Checklist visual overlay */}
              <div className="bg-slate-100 dark:bg-slate-950/60 h-24 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 flex flex-col justify-center gap-2.5">
                <div className="flex items-center gap-2.5">
                  <MaterialIcon name="check_circle" className="text-emerald-500" size="sm" style={{ fontVariationSettings: "'FILL' 1" }} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-350">Dosage within standard limits</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MaterialIcon name="check_circle" className="text-emerald-500" size="sm" style={{ fontVariationSettings: "'FILL' 1" }} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-350">No known allergies detected</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Smart Recommendations */}
          <motion.div variants={fadeInUp(25)}>
            <Card 
              variant="glass" 
              hoverEffect={true} 
              className="p-8 h-full flex flex-col bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <MaterialIcon name="savings" className="text-primary" size="2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Smart Recommendations
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Suggests clinically equivalent generic alternatives to reduce patient out-of-pocket costs and improve medication adherence.
              </p>
            </Card>
          </motion.div>

          {/* Card 4: Analytics Dashboard */}
          <motion.div variants={fadeInUp(25)}>
            <Card 
              variant="glass" 
              hoverEffect={true} 
              className="p-8 h-full flex flex-col bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <MaterialIcon name="monitoring" className="text-primary" size="2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Track prescription trends, fulfillment rates, and patient adherence metrics in a clean, high-density dashboard interface.
              </p>
            </Card>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
