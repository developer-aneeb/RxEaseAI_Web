import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Navbar from '../../components/layout/Navbar';
import Spinner from '../../components/ui/Spinner';
import {
  BellRing, AlertTriangle, Sparkles, TrendingUp, Download, Activity, Pill
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

import AdherenceTab from './AdherenceTab';
import MissedDosesTab from './MissedDosesTab';
import RemindersTab from './RemindersTab';
import PatternsTab from './PatternsTab';
import MedicineAnalyticsTab from './MedicineAnalyticsTab';

export default function AnalyticsPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [activeTab, setActiveTab] = useState('Adherence'); // 'Adherence', 'Missed', 'Reminders', 'Patterns', 'Medicine Analyzer'

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [optApplied, setOptApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [adherenceData, setAdherenceData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [missedData, setMissedData] = useState(null);
  const [remindersData, setRemindersData] = useState(null);
  const [patternsData, setPatternsData] = useState(null);
  const [consistencyData, setConsistencyData] = useState(null);

  const fetchTabData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'Adherence' && !adherenceData) {
        const response = await analyticsService.getReport();
        const data = response?.data || {};
        setAdherenceData(data);

        const dailyList = data.dailyTrend || [];
        const mappedLogs = dailyList.map((d, idx) => {
          const actionable = (d.taken || 0) + (d.skipped || 0) + (d.missed || 0);
          const rate = actionable > 0 ? ((d.taken || 0) / actionable) * 100 : 0;
          let status = 'Optimal';
          if (rate < 70) status = 'Flagged';
          else if (rate < 90) status = 'Acceptable';
          return {
            id: String(idx + 1),
            date: new Date(d.date).toLocaleDateString(),
            scheduled: d.due || 0,
            taken: d.taken || 0,
            skipped: d.skipped || 0,
            missed: d.missed || 0,
            adherence: Math.round(rate),
            status
          };
        });
        setLogs(mappedLogs.reverse());
      }
      else if (activeTab === 'Missed' && !missedData) {
        const res = await analyticsService.getMissedDoses();
        setMissedData(res?.data || {});
      }
      else if (activeTab === 'Reminders' && !remindersData) {
        const res = await analyticsService.getRemindersSummary();
        setRemindersData(res?.data || {});
      }
      else if (activeTab === 'Patterns' && (!patternsData || !consistencyData)) {
        const [consRes, patRes] = await Promise.all([
          analyticsService.getConsistency(),
          analyticsService.getWeeklyPatterns()
        ]);
        setConsistencyData(consRes?.data || {});
        setPatternsData(patRes?.data || {});
      }
      else if (activeTab === 'Medicine Analyzer' && !remindersData) {
        const res = await analyticsService.getRemindersSummary();
        setRemindersData(res?.data || {});
      }
    } catch (error) {
      console.error(error);
      showToast(getFriendlyErrorMessage(error, 'Failed to fetch analytics.'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const handleApplyOptimization = async () => {
    try {
      await analyticsService.getOptimizationOptions();
      setOptApplied(true);
      showToast('Evening medication routine optimization applied successfully!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to apply optimization.', 'error');
    }
  };

  const handleDownloadPDF = () => {
    showToast('Generating compliance report print view...', 'info');
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  // Shared NavLinks
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'Search', href: '#search' },
    { name: 'Reminders', href: '#reminders' },
    { name: 'Notifications', href: '#notifications' },
    { name: 'Prescription Analytics', href: '#prescription-analytics' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16 print:pt-4 print:pb-4 print:bg-white print:text-black">
      <Navbar links={navLinks} />

      {/* Grid background & ambient glow */}
      <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-50 dark:opacity-30 print:hidden"></div>
      <div className="fixed inset-0 pointer-events-none z-0 print:hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">
        <div className="flex flex-col gap-8">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary-fixed-dim uppercase tracking-wider text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Analytics & Reports</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-850 dark:text-white">
                Monitor Medicine <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Adherence</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Real-time synthesis of patient medication compliance, missed doses metrics and AI optimization patterns.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-primary to-emerald-500 hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer print:hidden animate-fade-up"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </Button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto gap-2 border-b border-slate-200/50 dark:border-slate-800 scrollbar-hide animate-fade-up print:hidden">
            {[
              { id: 'Adherence', icon: Activity },
              { id: 'Missed', icon: AlertTriangle },
              { id: 'Reminders', icon: BellRing },
              { id: 'Patterns', icon: TrendingUp },
              { id: 'Medicine Analyzer', icon: Pill }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.id}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="w-full min-h-[400px]">
            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* TAB: ADHERENCE */}
                  {activeTab === 'Adherence' && (
                    <AdherenceTab
                      adherenceData={adherenceData}
                      logs={logs}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      optApplied={optApplied}
                      handleApplyOptimization={handleApplyOptimization}
                    />
                  )}

                  {/* TAB: MISSED DOSES */}
                  {activeTab === 'Missed' && (
                    <MissedDosesTab data={missedData} />
                  )}

                  {/* TAB: REMINDERS */}
                  {activeTab === 'Reminders' && (
                    <RemindersTab data={remindersData} />
                  )}

                  {/* TAB: PATTERNS */}
                  {activeTab === 'Patterns' && (
                    <PatternsTab consistency={consistencyData} patterns={patternsData} />
                  )}

                  {/* TAB: MEDICINE ANALYZER */}
                  {activeTab === 'Medicine Analyzer' && (
                    <MedicineAnalyticsTab remindersList={remindersData?.reminders || []} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
