import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../../ui/SectionHeader';
import Card from '../../ui/Card';
import MaterialIcon from '../../ui/MaterialIcon';

export default function HomeFaq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: 'How accurate is the handwriting recognition?',
      a: 'Our specialized medical OCR model currently achieves 99.4% accuracy on standard physician handwriting. In cases of low confidence, the system flags the field for human review before proceeding.',
    },
    {
      q: 'Does RxEaseAI integrate with my existing EHR?',
      a: 'Yes. We support standard FHIR and HL7 protocols, enabling seamless out-of-the-box integration with major EHR/EMR systems like Epic, Cerner, Allscripts, Athenahealth, and proprietary pharmacy platforms.',
    },
    {
      q: 'Is patient data stored to train the AI?',
      a: 'No. Patient data is processed transiently and securely. We enforce strict zero-knowledge encryption and AES-256 data-at-rest policies. We never store or utilize your PHI to train models without explicit consent.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="glow-spot top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          title="Frequently Asked Questions"
          align="center"
        />

        {/* FAQ Items */}
        <div className="space-y-4 text-left mt-12">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <Card
                key={index}
                variant="glass"
                className="overflow-hidden bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-850 transition-colors text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-slate-800 dark:text-white text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0"
                  >
                    <MaterialIcon name="expand_more" size="md" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 pt-2 text-slate-600 dark:text-slate-350 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
