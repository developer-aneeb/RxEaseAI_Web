import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, FileText, CheckCircle2, AlertCircle, 
  Clock, Search, Plus, Filter, ArrowUpRight, Check
} from 'lucide-react';

export default function Dashboard() {
  const [selectedRow, setSelectedRow] = useState(null);

  const prescriptions = [
    { id: 'RX-9082', patient: 'Amina Khan', drug: 'Amoxicillin 500mg', date: 'Just Now', status: 'Pending Verification', type: 'Antibiotic' },
    { id: 'RX-9081', patient: 'Imran Malik', drug: 'Metformin 1000mg', date: '10m ago', status: 'Verified', type: 'Anti-Diabetic' },
    { id: 'RX-9080', patient: 'Zainab Bibi', drug: 'Lisinopril 10mg', date: '30m ago', status: 'Verified', type: 'Anti-Hypertensive' },
    { id: 'RX-9079', patient: 'Bilal Ahmed', drug: 'Atorvastatin 20mg', date: '1h ago', status: 'Flagged (Dosage)', type: 'Cholesterol' },
    { id: 'RX-9078', patient: 'Sana Saeed', drug: 'Ibuprofen 400mg', date: '2h ago', status: 'Verified', type: 'NSAID' },
  ];

  return (
    <section id="dashboard" className="relative py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background glow */}
      <div className="glow-spot bottom-1/3 left-1/4 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-xs font-semibold mb-4 uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            Centralized Hub
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            The Pharmacist Control Room
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-light leading-relaxed">
            Verify prescriptions, audit patient charts, and oversee processing metrics on a unified dashboard.
          </p>
        </div>

        {/* Dashboard Mockup Interface */}
        <div className="glassmorphism rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl overflow-hidden w-full transition-colors duration-300">
          
          {/* Top Header Bar */}
          <div className="bg-slate-100/50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-900/85 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
            
            {/* Title & Stats */}
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-slate-900 dark:text-white">Verification Queue</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                5 active
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search Patient, Rx ID..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors duration-300"
                />
              </div>
              <button className="p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs">
                <Filter className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors shadow-md shadow-indigo-600/10">
                <Plus className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>

          </div>

          {/* Main Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-900/85">
            
            {/* Left Queue Table (8 cols) */}
            <div className="lg:col-span-8 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-100/30 dark:bg-slate-900/20 text-slate-500 font-mono text-[10px] uppercase tracking-wider transition-colors duration-300">
                    <th className="py-4 px-6">ID & Patient</th>
                    <th className="py-4 px-4">Medication</th>
                    <th className="py-4 px-4">Recency</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-900/65">
                  {prescriptions.map((rx) => {
                    const isSelected = selectedRow === rx.id;
                    return (
                      <tr 
                        key={rx.id} 
                        onClick={() => setSelectedRow(rx.id)}
                        className={`hover:bg-slate-100/40 dark:hover:bg-slate-900/35 transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/15' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/85 flex items-center justify-center text-slate-600 dark:text-slate-400 font-mono text-xs transition-colors duration-300">
                              Rx
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-900 dark:text-white">{rx.patient}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{rx.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{rx.drug}</div>
                          <div className="text-[10px] text-slate-500">{rx.type}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-[11px] text-slate-550 dark:text-slate-400">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {rx.date}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            rx.status === 'Verified' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : rx.status === 'Pending Verification'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}>
                            {rx.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                            {rx.status === 'Pending Verification' && <Clock className="w-3 h-3" />}
                            {rx.status.includes('Flagged') && <AlertCircle className="w-3 h-3" />}
                            {rx.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                            View <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Right Audit Side Panel (4 cols) */}
            <div className="lg:col-span-4 p-6 bg-slate-100/10 dark:bg-slate-900/20 text-left transition-colors duration-300">
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
                Prescription Audit Details
              </h3>

              {selectedRow ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono">PATIENT</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {prescriptions.find(r => r.id === selectedRow)?.patient}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono">PRESCRIBED DRUG</span>
                    <p className="text-sm font-bold text-indigo-650 dark:text-indigo-400">
                      {prescriptions.find(r => r.id === selectedRow)?.drug}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-500 font-mono">AI CONFIDENCE SCORE</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">99.1%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full w-[99.1%]" />
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors">
                    <Check className="w-4 h-4" />
                    Approve Prescription
                  </button>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
                  <FileText className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">Select a prescription from the queue to view full audit details.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
