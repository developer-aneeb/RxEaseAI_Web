import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

const FAQS = [
  {
    q: "How accurate is the RxEaseAI OCR engine?",
    a: "Our clinical vision models achieve a 99.8% extraction accuracy on high-resolution clinical prescription documents, utilizing advanced character-segmentation and clinical FHIR dictionary checks."
  },
  {
    q: "Are patient records HIPAA compliant?",
    a: "Yes, RxEaseAI enforces strict HIPAA-compliant protocols. All patient identifier nodes (FHIR resources) are fully encrypted at rest and in transit using industry-standard SSL and AES-256."
  },
  {
    q: "Can I review and edit OCR extracted medicine data before saving?",
    a: "Yes! After uploading or scanning a prescription document, our clinical result workspace provides an interactive review panel where you can edit dosages, frequencies, and drug names before final clinical verification."
  },
  {
    q: "How do I download or share my verified prescription reports?",
    a: "You can download single or multiple prescription analysis reports in PDF format directly from the Prescription History page, or generate secure sharing links for patients and collaborating physicians."
  },
  {
    q: "What should I do if a potential drug-drug interaction is flagged?",
    a: "When the system flags a severe contraindication or drug interaction, review the clinical severity badge and the AI-suggested therapeutic alternatives before dispensing or finalizing the treatment regimen."
  },
  {
    q: "Can I customize notification alert groups and frequency?",
    a: "Yes! In the Notification Preferences card on this page, you can toggle instant mobile push notifications, weekly adherence email digests, and critical safety SMS alerts."
  }
];

export default function FaqSection() {
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  return (
    <Card id="faq-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h3>
      </div>

      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="border-b border-slate-100 dark:border-slate-805/60 pb-3">
            <button
              onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
              className="w-full flex justify-between items-center font-bold text-xs text-slate-700 dark:text-slate-250 cursor-pointer border-0 bg-transparent p-0"
            >
              <span className="text-left">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${faqOpenIndex === idx ? 'rotate-180 text-primary' : 'text-slate-450'}`} />
            </button>

            <AnimatePresence>
              {faqOpenIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium font-sans">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Card>
  );
}
