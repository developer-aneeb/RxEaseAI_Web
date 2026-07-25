import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MaterialIcon from '../ui/MaterialIcon';

export default function DemoVideoSection() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(e => console.log("Autoplay prevented", e));
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <section id="demo" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            See <span className="text-primary">RxEaseAI</span> in Action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Watch how our intelligent platform simplifies prescription management, automates workflows, and provides accurate medical insights.
          </motion.p>
        </div>

        <motion.div 
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative max-w-5xl mx-auto rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          {/* Mac-like window controls for aesthetics */}
          <div className="w-full h-10 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          
          <div className="aspect-video w-full bg-slate-900 relative group cursor-pointer" onClick={() => {
            if (videoRef.current) {
              if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
              } else {
                videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
              }
            }
          }}>
            <video
              ref={videoRef}
              src="/demo.mp4"
              className="w-full h-full object-cover"
              playsInline
              loop
              muted
            />
            
            {/* Play/Pause Overlay Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/90 hover:bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 backdrop-blur-sm transition-colors">
                  <MaterialIcon name="play_arrow" className="text-4xl ml-2" size="none" />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
