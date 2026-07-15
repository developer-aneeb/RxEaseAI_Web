import { motion } from 'framer-motion';
import SectionHeader from '../../ui/SectionHeader';
import MaterialIcon from '../../ui/MaterialIcon';

export default function Workflow() {
  const steps = [
    {
      id: 1,
      title: '1. Secure Upload',
      description: 'HIPAA-compliant ingestion of prescription images.',
      icon: 'cloud_upload',
      color: 'text-indigo-600 dark:text-indigo-400',
      align: 'left',
    },
    {
      id: 2,
      title: '2. YOLO Vision',
      description: 'YOLO instance segmentation isolates text regions instead of simple box detection.',
      icon: 'visibility',
      color: 'text-[#0F6FFF]',
      align: 'right',
    },
    {
      id: 3,
      title: '3. Medical OCR',
      description: 'Specialized neural networks decode complex handwriting.',
      icon: 'document_scanner',
      color: 'text-[#1DBF73]',
      align: 'left',
    },
    {
      id: 4,
      title: '4. Data Structuring',
      description: 'Outputs clean, FHIR-compatible JSON for EHR integration.',
      icon: 'data_object',
      color: 'text-purple-600 dark:text-purple-400',
      align: 'right',
    },
  ];

  return (
    <section id="workflow" className="relative py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">

      {/* Background Glow  */}
      <div className="glow-spot top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header  */}
        <SectionHeader
          title="Intelligent Workflow"
          subtitle="Seamlessly transforming raw handwriting into structured clinical intelligence."
        />

        {/* Timeline Container */}
        <div className="relative max-w-3xl mx-auto mt-16">

          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[3px] bg-slate-200 dark:bg-slate-800/80 rounded-full transform md:-translate-x-1/2 transition-colors duration-300">
            {/* Animated timeline gradient line */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#0F6FFF] to-[#1DBF73] rounded-full"
            />
          </div>

          {/* Steps */}
          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => {
              const isLeft = step.align === 'left';
              return (
                <div
                  key={step.id}
                  className="flex flex-row items-center gap-4 md:gap-0"
                >
                  {/* Left Column (Desktop only)  */}
                  <div className={`hidden md:block flex-1 text-right md:pr-8 ${!isLeft ? 'invisible pointer-events-none' : ''}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Center Circle Icon  */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.15 }}
                    className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center z-10 shrink-0 transition-colors duration-300"
                  >
                    <MaterialIcon name={step.icon} color={step.color} size="2xl" />
                  </motion.div>

                  {/* Right Column (Mobile: All steps, Desktop: Right aligned steps)  */}
                  <div className={`flex-1 pl-4 md:pl-8 text-left ${isLeft ? 'md:invisible md:pointer-events-none' : ''}`}>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}