import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: 'How accurate is the RxEaseAI handwriting OCR?',
      a: 'RxEaseAI achieves over 99.2% accuracy on standard clinical prescriptions. Our custom line and character segmenters are specifically trained on handwriting variations of medical practitioners globally.',
    },
    {
      q: 'Is the platform HIPAA and SOC 2 compliant?',
      a: 'Absolutely. We enforce end-to-end encryption for both data-in-transit and data-at-rest. The platform features strict access tokens, role-based controls, and automated audit logs ensuring fully HIPAA-compliant pipelines.',
    },
    {
      q: 'What EMR systems can RxEaseAI sync with?',
      a: 'We support standard FHIR and HL7 protocols. This enables seamless, out-of-the-box integration with Epic, Cerner, Allscripts, Athenahealth, and proprietary local pharmacy systems.',
    },
    {
      q: 'Can it detect incorrect dosages or drug-to-drug interactions?',
      a: 'Yes. RxEaseAI features an integrated Clinical safety engine that cross-references extracted drug names and dosages against global health databases to flag possible outliers or interactions for pharmacist review.',
    },
    {
      q: 'Does it support scanned PDFs and mobile camera uploads?',
      a: 'Yes, the system is fully responsive. Pharmacists can scan documents via desktop scanners, import high-res PDFs, or snap a photo directly using the mobile web app camera.',
    },
  ];

  return (
    <section id="faq" className="relative py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background Glow */}
      <div className="glow-spot bottom-1/4 right-1/4 translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          badgeText="Support"
          badgeIcon={HelpCircle}
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about setting up and operating RxEaseAI."
        />

        {/* FAQ List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <Card
                key={index}
                variant="glass"
                className="overflow-hidden"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-550 dark:text-slate-400 shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
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
                      <div className="px-6 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-350 font-light leading-relaxed border-t border-slate-100 dark:border-slate-900/60 transition-colors duration-300">
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
