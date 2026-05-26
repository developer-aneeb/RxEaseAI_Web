import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, ShieldCheck, Sparkles } from 'lucide-react';

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('efficiency');

  const tabs = [
    { id: 'efficiency', label: 'Pharmacy Efficiency' },
    { id: 'accuracy', label: 'Accuracy & Compliance' },
    { id: 'volume', label: 'Integration Volume' },
  ];

  const stats = {
    efficiency: [
      { label: 'Avg Ingestion Time', value: '1.8s', change: '-84% vs manual entry', icon: Sparkles },
      { label: 'Pharmacist Time Saved', value: '4.2 hrs', change: 'per shifts daily', icon: TrendingUp },
      { label: 'Queue Clearance Rate', value: '98.8%', change: '+14% improvement', icon: BarChart2 },
    ],
    accuracy: [
      { label: 'OCR Transcription Accuracy', value: '99.2%', change: 'Validated clinical dataset', icon: ShieldCheck },
      { label: 'Dosage Flag Coverage', value: '100%', change: 'All prescriptions audited', icon: Sparkles },
      { label: 'Dispensing Errors Prevented', value: '142', change: 'in past 30 days', icon: TrendingUp },
    ],
    volume: [
      { label: 'API Ingestion Requests', value: '1.2M', change: '99.99% uptime SLA', icon: BarChart2 },
      { label: 'Active Connected EHRs', value: '84', change: 'Major hospital systems', icon: ShieldCheck },
      { label: 'Daily Scans Processed', value: '45,820', change: 'Average volume per day', icon: Sparkles },
    ],
  };

  return (
    <section id="analytics" className="relative py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background Glow */}
      <div className="glow-spot top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-xs font-semibold mb-4 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Performance Insights
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Real-Time Analytics & Audit Logs
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-light leading-relaxed">
            Monitor processing speeds, transcription metrics, and clinical safety KPIs dynamically.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-12">
          <div className="glassmorphism p-1.5 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-800/80">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats[activeTab].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glassmorphism rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 text-left flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-450 font-medium mt-1">
                    {stat.change}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Graphic Panel */}
        <div className="mt-12 glassmorphism rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Queue Latency (Seconds)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
                Tracking AI server roundtrip processing time including document image segmentation and clinical database checks.
              </p>
            </div>
            
            {/* Mock Chart using SVG paths */}
            <div className="w-full md:w-96 h-24 relative">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <path
                  d="M0 80 Q 40 40, 80 60 T 160 30 T 240 50 T 300 10 L 300 100 L 0 100 Z"
                  fill="url(#chartGrad)"
                />
                {/* Line */}
                <path
                  d="M0 80 Q 40 40, 80 60 T 160 30 T 240 50 T 300 10"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Highlight Point */}
                <circle cx="160" cy="30" r="4.5" fill="#a855f7" />
              </svg>
              <div className="absolute top-1 left-[165px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-[9px] font-mono text-slate-700 dark:text-purple-400 transition-colors duration-300">
                1.8s (Peak Load)
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
