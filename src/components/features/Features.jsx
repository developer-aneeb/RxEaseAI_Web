import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Link, ShieldCheck, Database, Layers, HeartPulse } from 'lucide-react';

export default function Features() {
  const featuresList = [
    {
      icon: Cpu,
      title: 'Handwriting Parsing',
      description: 'Translates unstructured handwritten prescriptions into structured text with over 99.2% accuracy.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Link,
      title: 'Instant EMR Sync',
      description: 'Plugs directly into major pharmacy and hospital EMR systems using secure HL7/FHIR APIs.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: HeartPulse,
      title: 'Dosage Safety Engine',
      description: 'Checks prescribed doses, patient age limits, and refills to ensure patient safety and compliance.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Database,
      title: 'Structured Outputs',
      description: 'Outputs standardized JSON structures directly, ready for parsing or SQL injection workflows.',
      color: 'from-pink-500 to-red-600',
    },
    {
      icon: Layers,
      title: 'Segmenter Pipeline',
      description: 'Segments text regions, lines, and tokens before OCR analysis, providing higher reliability.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: ShieldCheck,
      title: 'HIPAA & SOC 2 Secured',
      description: 'Features enterprise-grade encryption and access controls, protecting all patient health records.',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="features" className="relative py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background glow */}
      <div className="glow-spot top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-xs font-semibold mb-4 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Cutting Edge Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Engineered for Precision & Speed
          </h2>
          <p className="text-slate-650 dark:text-slate-400 text-lg font-light leading-relaxed">
            Discover a comprehensive suite of AI tools designed to streamline clinical ingestion workflows.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative glassmorphism rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 text-left cursor-default flex flex-col justify-between"
              >
                {/* Glowing border outline on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />

                <div>
                  {/* Icon Wrapper */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-6 shadow-md shadow-indigo-600/10`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-650 dark:group-hover:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-350">
                  <span>Learn more</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
