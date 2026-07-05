import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';
import Spinner from '../../components/ui/Spinner';
import {
  BellRing, CheckCircle, AlertTriangle, Sparkles, TrendingUp,
  Download, MoreVertical, Filter as FilterIcon, ChevronLeft, ChevronRight,
  Search, Check, Plus, HelpCircle, ShieldAlert, ArrowUpRight, Activity, Calendar, Clock,
  FileText, Pill
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

export default function AnalyticsPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [activeTab, setActiveTab] = useState('Adherence'); // 'Adherence', 'Missed', 'Prescriptions', 'Reminders', 'Patterns'
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [optApplied, setOptApplied] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [adherenceData, setAdherenceData] = useState(null);
  const [logs, setLogs] = useState([]);
  
  const [missedData, setMissedData] = useState(null);
  const [prescriptionsData, setPrescriptionsData] = useState(null);
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
      else if (activeTab === 'Prescriptions' && !prescriptionsData) {
        const res = await analyticsService.getPrescriptionStats();
        setPrescriptionsData(res?.data || {});
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
    { name: 'New Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Recommendations', href: '#recommendations' },
    { name: 'Search', href: '#search' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Reminders', href: '#reminders' },
    { name: 'Notifications', href: '#notifications' },
    { name: 'Dashboard', href: '#history-dashboard' },
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
                Real-time synthesis of patient medication compliance, missed doses metrics, prescription workflows, and AI optimization patterns.
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
              { id: 'Prescriptions', icon: FileText },
              { id: 'Reminders', icon: BellRing },
              { id: 'Patterns', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === tab.id
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

                  {/* TAB: PRESCRIPTIONS */}
                  {activeTab === 'Prescriptions' && (
                    <PrescriptionsTab data={prescriptionsData} />
                  )}

                  {/* TAB: REMINDERS */}
                  {activeTab === 'Reminders' && (
                    <RemindersTab data={remindersData} />
                  )}

                  {/* TAB: PATTERNS */}
                  {activeTab === 'Patterns' && (
                    <PatternsTab consistency={consistencyData} patterns={patternsData} />
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

// ----------------------------------------------------
// TAB COMPONENTS
// ----------------------------------------------------

function AdherenceTab({ 
  adherenceData, logs, searchTerm, setSearchTerm, statusFilter, setStatusFilter, 
  currentPage, setCurrentPage, optApplied, handleApplyOptimization 
}) {
  const stats = {
    total: adherenceData?.summary?.totalDoses || 0,
    taken: adherenceData?.summary?.takenDoses || 0,
    missed: adherenceData?.summary?.missedDoses || 0,
    rate: Math.round(adherenceData?.summary?.adherenceRate || 0)
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.date.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-white/70 dark:bg-slate-900/80 text-left">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider">Total Reminders</h3>
            <BellRing className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-4 relative z-10">
            <div className="text-3xl font-black text-slate-800 dark:text-white">{stats.total}</div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-white/70 dark:bg-slate-900/80 text-left">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider">Taken On Time</h3>
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-white">{stats.taken}</div>
            <div className="text-[10px] text-emerald-500 font-bold mt-1">Active compliance</div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-white/70 dark:bg-slate-900/80 text-left">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wider">Missed Doses</h3>
            <div className="w-7 h-7 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-white">{stats.missed}</div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-purple-50/40 to-emerald-50/10 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-slate-900/80 border border-indigo-500/20 shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Adherence Rate</h3>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-end justify-between mt-4">
            <div>
              <div className="text-3xl font-black text-slate-855 dark:text-white">{stats.rate}%</div>
              <div className="text-[10px] text-indigo-500 font-semibold mt-1">Target: 95%</div>
            </div>
            <div className="relative w-10 h-10 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                <path className="text-indigo-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats.rate}, 100`} strokeLinecap="round" strokeWidth="4"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">{stats.rate}%</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="glass" className="lg:col-span-1 p-5 flex flex-col gap-4 bg-white dark:bg-slate-900 text-left">
          <h3 className="text-sm font-bold text-slate-805 dark:text-white mb-1">Recent Performance</h3>
          {logs.slice(0, 3).map((l, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-355">{l.date}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  l.adherence >= 90 ? 'text-emerald-500 bg-emerald-500/10' : 'text-primary bg-primary/10'
                }`}>{l.adherence}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 border border-slate-200/55 dark:border-slate-850 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${
                  l.adherence >= 90 ? 'bg-emerald-500' : 'bg-primary'
                }`} style={{ width: `${l.adherence}%` }}></div>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-xs text-slate-400 py-6">No performance metrics recorded.</p>
          )}
        </Card>

        <Card variant="glass" className="lg:col-span-2 p-6 flex flex-col md:flex-row gap-5 items-start relative overflow-hidden bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-slate-900 border border-indigo-500/20 text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 relative z-10 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">RxEaseAI Diagnostic Insight</span>
              <Badge variant="tertiary" className="text-[10px] font-bold">High Confidence</Badge>
            </div>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light font-sans">
              RxEaseAI analyzed your compliance logs and detected adherence spikes near meal schedules. We recommend matching reminder timings directly with meals to optimize therapeutic efficacy.
            </p>
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="text-[10px] text-slate-500 max-w-sm">Recommendation: Adjust reminder timings to align with standard dinner routines.</span>
              <Button
                variant={optApplied ? "outline" : "primary"}
                onClick={handleApplyOptimization}
                disabled={optApplied}
                className={`text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${optApplied ? 'bg-slate-100 dark:bg-slate-800 opacity-60 text-slate-455' : 'bg-indigo-650 hover:bg-indigo-600 text-white shadow-md'}`}
              >
                {optApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied</span>
                  </>
                ) : (
                  <span>Apply Optimization</span>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="glass" className="overflow-hidden border border-slate-200 dark:border-slate-805 shadow-md bg-white dark:bg-slate-900">
        <div className="p-5 border-b border-slate-200/60 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white text-left">Compliance Log</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search date..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-800 dark:text-slate-105"
              />
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-1 px-2.5 shadow-sm text-xs font-semibold text-slate-655">
              <FilterIcon className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none text-[11px] font-bold focus:outline-none cursor-pointer pr-4"
              >
                <option value="All">All Statuses</option>
                <option value="Optimal">Optimal</option>
                <option value="Acceptable">Acceptable</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/30 text-slate-455 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-850">
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Scheduled Doses</th>
                <th className="px-6 py-4 font-bold text-center">Taken Doses</th>
                <th className="px-6 py-4 font-bold text-center">Missed Doses</th>
                <th className="px-6 py-4 font-bold text-right">Adherence Rate</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-850/80">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-left">{log.date}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-left">{log.scheduled}</td>
                  <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200">{log.taken}</td>
                  <td className={`px-6 py-4 text-center ${log.missed > 5 ? 'text-rose-500 font-bold' : 'text-slate-455 dark:text-slate-500'}`}>{log.missed}</td>
                  <td className={`px-6 py-4 text-right font-bold ${log.adherence >= 90 ? 'text-emerald-500' : log.adherence >= 75 ? 'text-primary' : 'text-rose-500'}`}>{log.adherence}%</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${log.status === 'Optimal'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
                        : log.status === 'Acceptable'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                      <span className={`w-1 h-1 rounded-full ${log.status === 'Optimal' ? 'bg-emerald-500' : log.status === 'Acceptable' ? 'bg-primary' : 'bg-rose-500 animate-pulse'
                        }`}></span>
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-455 dark:text-slate-500">
                    <span className="material-symbols-outlined text-[24px] mb-2 opacity-50">filter_list_off</span>
                    <div>No logs found matching selection.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-855 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
          <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
            Showing {paginatedLogs.length} of {filteredLogs.length} entries
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-455 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all cursor-pointer ${currentPage === page
                    ? 'bg-primary border-primary text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-455 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MissedDosesTab({ data }) {
  const byTimeOfDay = data?.patterns?.byTimeOfDay || {};
  const recentMissed = data?.recentMissed || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="p-6 text-left border-rose-500/20">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-500" /> Patterns by Time of Day
          </h3>
          <div className="space-y-4">
            {Object.entries(byTimeOfDay).map(([time, count]) => (
              <div key={time}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize font-medium text-slate-600 dark:text-slate-400">{time}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{count} misses</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${Math.min((count / Math.max(...Object.values(byTimeOfDay), 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card variant="glass" className="p-6 text-left border-orange-500/20">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" /> Recent Missed Doses
          </h3>
          <div className="space-y-3">
            {recentMissed.length > 0 ? recentMissed.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{item.medicineName}</span>
                  <span className="text-[10px] text-slate-500">{new Date(item.scheduledTime).toLocaleString()}</span>
                </div>
                <Badge variant="tertiary" className="text-rose-500 bg-rose-500/10 border-rose-500/20">Missed</Badge>
              </div>
            )) : (
              <p className="text-xs text-slate-500 py-4">No recent missed doses found.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PrescriptionsTab({ data }) {
  const { summary, monthlyTrend } = data || {};
  const statusBreakdown = summary?.statusBreakdown || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-5 text-left bg-white/70 dark:bg-slate-900/80 border-emerald-500/20">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Uploads</h3>
          <div className="text-3xl font-black">{summary?.total || 0}</div>
        </Card>
        <Card variant="glass" className="p-5 text-left bg-white/70 dark:bg-slate-900/80 border-emerald-500/20">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avg Processing Time</h3>
          <div className="text-3xl font-black">{summary?.avgProcessingMinutes || 0} <span className="text-sm">min</span></div>
        </Card>
        <Card variant="glass" className="p-5 text-left bg-white/70 dark:bg-slate-900/80 border-emerald-500/20">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Processed Scans</h3>
          <div className="text-3xl font-black text-emerald-500">{statusBreakdown.processed || 0}</div>
        </Card>
      </div>
      
      <Card variant="glass" className="p-6 text-left">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Monthly Processing Trend</h3>
        <div className="space-y-4">
          {monthlyTrend?.length > 0 ? monthlyTrend.map((m) => (
            <div key={m.month} className="flex items-center gap-4">
              <span className="text-xs font-medium w-16 text-slate-500">{m.month}</span>
              <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${(m.processed / m.total) * 100}%` }} title="Processed"></div>
                <div className="h-full bg-rose-500" style={{ width: `${(m.failed / m.total) * 100}%` }} title="Failed"></div>
              </div>
              <span className="text-xs font-bold w-8 text-right">{m.total}</span>
            </div>
          )) : (
            <p className="text-xs text-slate-500 py-4">No prescription data available.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function RemindersTab({ data }) {
  const { summary } = data || {};
  const byScheduleType = summary?.byScheduleType || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="p-6 text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <BellRing className="w-4 h-4 text-primary" /> Active Status
          </h3>
          <div className="flex justify-around items-center py-4">
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-500">{summary?.active || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Active</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-slate-400">{summary?.inactive || 0}</div>
              <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Inactive</div>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6 text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" /> By Schedule Type
          </h3>
          <div className="space-y-3">
            {Object.keys(byScheduleType).length > 0 ? Object.entries(byScheduleType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">{type.replace('_', ' ')}</span>
                <Badge variant="primary" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">{count} active</Badge>
              </div>
            )) : (
              <p className="text-xs text-slate-500 py-4">No schedule types found.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PatternsTab({ consistency, patterns }) {
  const { summary: consSummary, message: consMsg } = consistency || {};
  const { weekdayAdherence, message: patMsg } = patterns || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-5 text-left bg-gradient-to-br from-primary/5 to-emerald-500/5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Days Tracked</h3>
          <div className="text-3xl font-black">{consSummary?.daysTracked || 0}</div>
        </Card>
        <Card variant="glass" className="p-5 text-left bg-gradient-to-br from-primary/5 to-emerald-500/5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Doses Tracked</h3>
          <div className="text-3xl font-black">{consSummary?.totalScheduled || 0}</div>
        </Card>
        <Card variant="glass" className="p-5 text-left bg-gradient-to-br from-primary/5 to-emerald-500/5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Consistency</h3>
          <div className="text-3xl font-black text-primary">{consSummary?.adherenceRate || 0}%</div>
        </Card>
      </div>

      <Card variant="glass" className="p-6 text-left">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Weekly Adherence Patterns
          </h3>
          <p className="text-xs text-slate-500 mt-1">{patMsg || "Track your daily consistency across the week."}</p>
        </div>
        
        <div className="space-y-4">
          {weekdayAdherence?.length > 0 ? weekdayAdherence.map((day) => (
            <div key={day.day}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600 dark:text-slate-400">{day.day}</span>
                <span className="font-bold text-slate-800 dark:text-white">{day.adherenceRate}% ({day.taken}/{day.scheduled})</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${day.adherenceRate >= 90 ? 'bg-emerald-500' : day.adherenceRate >= 70 ? 'bg-primary' : 'bg-rose-500'}`} 
                  style={{ width: `${day.adherenceRate}%` }}
                ></div>
              </div>
            </div>
          )) : (
            <p className="text-xs text-slate-500 py-4">No pattern data available yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
