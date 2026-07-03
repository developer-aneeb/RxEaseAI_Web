import { motion } from 'framer-motion';
import SectionHeader from '../../ui/SectionHeader';
import MaterialIcon from '../../ui/MaterialIcon';
import { fadeInUp, staggerContainer } from '../../../animations/variants';

export default function HomeWorkflow() {
  const steps = [
    {
      id: 1,
      title: 'Upload',
      description: 'Snap a photo or upload a scanned prescription.',
      icon: 'upload_file',
      iconColor: 'text-primary',
      borderColor: 'border-slate-200 dark:border-slate-800',
      isAi: false,
    },
    {
      id: 2,
      title: 'AI Extraction',
      description: 'Advanced OCR reads handwriting instantly.',
      icon: 'document_scanner',
      iconColor: 'text-tertiary',
      borderColor: 'border-tertiary/50',
      isAi: true,
    },
    {
      id: 3,
      title: 'Verification',
      description: 'Cross-checks medications and dosages for safety.',
      icon: 'fact_check',
      iconColor: 'text-emerald-500',
      borderColor: 'border-slate-200 dark:border-slate-800',
      isAi: false,
    },
    {
      id: 4,
      title: 'Smart Actions',
      description: 'Get generic alternatives and pharmacy options.',
      icon: 'smart_toy',
      iconColor: 'text-primary',
      borderColor: 'border-slate-200 dark:border-slate-800',
      isAi: false,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="glow-spot top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          title="Intelligent Workflow"
          subtitle="From paper to actionable clinical data in seconds."
        />

        {/* Steps Container */}
        <motion.div 
          className="relative mt-16"
          variants={staggerContainer(0.2, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-slate-200 dark:bg-slate-800/80 -translate-y-1/2 z-0" />

          {/* Grid of Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                variants={fadeInUp(25)}
                className="relative z-10 flex flex-col items-center text-center px-4"
              >
                {/* Icon Badge */}
                <div 
                  className={`w-24 h-24 rounded-full glass-panel bg-white dark:bg-slate-900 shadow-md flex items-center justify-center mb-6 border-2 ${
                    step.borderColor
                  } ${step.isAi ? 'ai-glow animate-[pulse_3s_infinite]' : ''}`}
                >
                  <MaterialIcon name={step.icon} className={`${step.iconColor}`} size="3xl" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-title-md">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-body-md max-w-[220px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
