import { Sparkles, Cpu, Link, ShieldCheck, Database, Layers, HeartPulse } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';

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
        <SectionHeader
          badgeText="Cutting Edge Features"
          badgeIcon={Sparkles}
          title="Engineered for Precision & Speed"
          subtitle="Discover a comprehensive suite of AI tools designed to streamline clinical ingestion workflows."
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={feat.title}
                variant="glass"
                animate={true}
                hoverEffect={true}
                className="p-6 text-left flex flex-col justify-between"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div>
                  {/* Icon Wrapper */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-6 shadow-md shadow-indigo-600/10`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-605 dark:group-hover:text-indigo-300 transition-colors">
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
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
