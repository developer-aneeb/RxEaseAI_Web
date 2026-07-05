import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';
import SideNavbar from '../../components/layout/SideNavbar';
import {
  BellRing, CheckCircle, AlertTriangle, Sparkles, TrendingUp,
  Download, MoreVertical, Filter as FilterIcon, ChevronLeft, ChevronRight,
  Search, Check, Plus, HelpCircle, ShieldAlert, ArrowUpRight
} from 'lucide-react';

const COMPLIANCE_LOGS = [
  { id: '1', medicine: 'Paracetamol 500mg', scheduled: '08:00 AM, 08:00 PM', taken: 28, missed: 2, adherence: 93, status: 'Optimal' },
  { id: '2', medicine: 'Amoxicillin 250mg', scheduled: '12:00 PM', taken: 12, missed: 3, adherence: 80, status: 'Acceptable' },
  { id: '3', medicine: 'Levothyroxine 50mcg', scheduled: '06:00 AM', taken: 19, missed: 11, adherence: 63, status: 'Flagged' },
  { id: '4', medicine: 'Lisinopril 10mg', scheduled: '09:00 AM', taken: 29, missed: 1, adherence: 96, status: 'Optimal' },
  { id: '5', medicine: 'Metformin 500mg', scheduled: '08:00 AM, 08:00 PM', taken: 58, missed: 2, adherence: 96, status: 'Optimal' },
  { id: '6', medicine: 'Atorvastatin 20mg', scheduled: '09:00 PM', taken: 25, missed: 5, adherence: 83, status: 'Acceptable' },
  { id: '7', medicine: 'Gabapentin 300mg', scheduled: '02:00 PM', taken: 15, missed: 15, adherence: 50, status: 'Flagged' },
  { id: '8', medicine: 'Ibuprofen 400mg', scheduled: 'As Needed', taken: 10, missed: 0, adherence: 100, status: 'Optimal' },
  { id: '9', medicine: 'Omeprazole 20mg', scheduled: '07:00 AM', taken: 29, missed: 1, adherence: 96, status: 'Optimal' },
  { id: '10', medicine: 'Aspirin 81mg', scheduled: '08:00 AM', taken: 23, missed: 7, adherence: 76, status: 'Acceptable' }
];

export default function AnalyticsPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [timeframe, setTimeframe] = useState('Week'); // 'Week' | 'Month'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Optimal' | 'Acceptable' | 'Flagged'
  const [currentPage, setCurrentPage] = useState(1);
  const [optApplied, setOptApplied] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Optimization Handler
  const handleApplyOptimization = () => {
    setOptApplied(true);
    showToast('Evening medication routine optimization applied successfully!', 'success');
  };

  // PDF Export Print Handler
  const handleDownloadPDF = () => {
    showToast('Generating compliance report print view...', 'info');
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  // Table filtering and search logic
  const filteredLogs = COMPLIANCE_LOGS.filter((log) => {
    const matchesSearch = log.medicine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Table Pagination
  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Missed Doses counts based on Week/Month timeframe
  const barHeights = timeframe === 'Week'
    ? { Aspirin: '80%', Lisinopril: '40%', Metformin: '60%', Statin: '20%', counts: [8, 4, 6, 2] }
    : { Aspirin: '95%', Lisinopril: '38%', Metformin: '75%', Statin: '25%', counts: [32, 12, 24, 8] };

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
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* SideNavBar - Desktop only */}
          {/* <Side/Navbar activeRoute="#analytics" /> */}

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary-fixed-dim uppercase tracking-wider text-xs font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span>Analytics & Reports</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-850 dark:text-white">
                  Monitor Medicine <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Adherence</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  Real-time synthesis of patient medication compliance, warnings, missed doses metrics, and AI compliance optimizations.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-primary to-emerald-500 hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer print:hidden"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Report</span>
              </Button>
            </div>

            {/* Metrics Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Card 1: Total Reminders */}
              <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:border-primary/30 transition-colors bg-white/70 dark:bg-slate-900/80">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider">Total Reminders</h3>
                  <BellRing className="w-5 h-5 text-slate-400" />
                </div>
                <div className="mt-4 relative z-10">
                  <div className="text-3xl font-black text-slate-800 dark:text-white">128</div>
                  <div className="text-[10px] text-primary font-bold mt-1 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% from last week</span>
                  </div>
                </div>
                {/* SVG Sparkline simulation */}
                <div className="absolute bottom-0 left-0 right-0 h-10 opacity-20 pointer-events-none z-0">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,90 L10,80 L20,85 L30,50 L40,75 L50,30 L60,65 L70,20 L80,50 L90,15 L100,5 M100,5 L100,100 L0,100 Z" fill="url(#sparklineGrad)" />
                    <path d="M0,90 L10,80 L20,85 L30,50 L40,75 L50,30 L60,65 L70,20 L80,50 L90,15 L100,5" fill="none" stroke="#0055c9" strokeWidth="2" />
                    <defs>
                      <linearGradient id="sparklineGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#0055c9" stopOpacity="1" />
                        <stop offset="100%" stopColor="#0055c9" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </Card>

              {/* Card 2: Taken On Time */}
              <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:border-emerald-500/30 transition-colors bg-white/70 dark:bg-slate-900/80">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider">Taken On Time</h3>
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black text-slate-800 dark:text-white">112</div>
                  <div className="text-[10px] text-emerald-500 font-bold mt-1">Excellent compliance</div>
                </div>
              </Card>

              {/* Card 3: Missed Doses */}
              <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:border-rose-500/30 transition-colors bg-white/70 dark:bg-slate-900/80">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider">Missed Doses</h3>
                  <div className="w-7 h-7 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-black text-slate-800 dark:text-white">16</div>
                  <div className="text-[10px] text-rose-500 font-bold mt-1">Requires attention</div>
                </div>
              </Card>

              {/* Card 4: AI Adherence Target */}
              <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-purple-50/40 to-emerald-50/10 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-slate-900/80 border border-indigo-500/20 shadow-md">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Adherence Rate</h3>
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <div className="text-3xl font-black text-slate-855 dark:text-white">87.5%</div>
                    <div className="text-[10px] text-indigo-500 font-semibold mt-1">AI Optimized Target: 95%</div>
                  </div>
                  {/* SVG Adherence Progress Ring */}
                  <div className="relative w-10 h-10 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                      <path className="text-indigo-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="87.5, 100" strokeLinecap="round" strokeWidth="4"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">87%</div>
                  </div>
                </div>
              </Card>

            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Chart 1: Adherence Trend */}
              <Card variant="glass" className="p-6 flex flex-col h-[340px] bg-white dark:bg-slate-900">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Adherence Trend</h3>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500">On Time vs Missed (Last 7 Days)</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-455 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {showOptionsDropdown && (
                      <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-30 text-left">
                        <button onClick={() => { showToast('Syncing with FHIR servers...', 'info'); setShowOptionsDropdown(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">Sync FHIR Core</button>
                        <button onClick={() => { showToast('Resetting graph filters', 'success'); setShowOptionsDropdown(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-rose-500">Reset Data</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SVG Area Chart */}
                <div className="flex-1 relative flex items-end justify-between px-2 gap-2 border-b border-l border-slate-200 dark:border-slate-800 pb-2 pl-4">
                  {/* Y Axis Labels */}
                  <div className="absolute left-[-10px] top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 font-mono">
                    <span>100%</span>
                    <span>50%</span>
                    <span>0%</span>
                  </div>

                  <svg className="absolute inset-0 w-full h-full pl-4 pb-2" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#0055c9" stopOpacity="0.25"></stop>
                        <stop offset="100%" stopColor="#0055c9" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>
                    {/* Area path for taken doses */}
                    <path d="M0,80 L15,60 L30,65 L45,40 L60,50 L75,20 L90,25 L100,10 L100,100 L0,100 Z" fill="url(#areaGradient)"></path>
                    {/* Line path for taken doses */}
                    <path d="M0,80 L15,60 L30,65 L45,40 L60,50 L75,20 L90,25 L100,10" fill="none" stroke="#0055c9" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"></path>
                    {/* Missed doses dashed line */}
                    <path d="M0,95 L15,90 L30,92 L45,85 L60,88 L75,95 L90,92 L100,85" fill="none" stroke="#ba1a1a" strokeDasharray="4 4" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"></path>
                  </svg>

                  {/* X Axis Labels */}
                  <div className="absolute bottom-[-20px] left-4 right-0 flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
              </Card>

              {/* Chart 2: Missed Dose Analytics */}
              <Card variant="glass" className="p-6 flex flex-col h-[340px] bg-white dark:bg-slate-900">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Missed Dose Analytics</h3>
                    <p className="text-[11px] text-slate-455 dark:text-slate-500">Frequency count by Medication</p>
                  </div>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="text-xs font-bold bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer shadow-sm text-slate-700 dark:text-slate-350"
                  >
                    <option value="Week">This Week</option>
                    <option value="Month">Last Month</option>
                  </select>
                </div>

                {/* Bar Chart Columns */}
                <div className="flex-1 flex items-end justify-around border-b border-l border-slate-200 dark:border-slate-800 pb-2 pl-4 relative">
                  {/* Y Axis Labels */}
                  <div className="absolute left-[-5px] top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 font-mono">
                    <span>{timeframe === 'Week' ? '10' : '40'}</span>
                    <span>{timeframe === 'Week' ? '5' : '20'}</span>
                    <span>0</span>
                  </div>

                  {/* Column 1: Aspirin */}
                  <div className="w-12 h-full flex flex-col justify-end items-center group relative">
                    <div className="absolute top-[-22px] bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      {barHeights.counts[0]} missed
                    </div>
                    <div
                      className="w-full bg-primary/20 dark:bg-slate-805 border border-slate-200 dark:border-slate-800 rounded-t-lg overflow-hidden flex items-end"
                      style={{ height: '80%' }}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-primary to-indigo-500 transition-all duration-500 ease-out origin-bottom rounded-t-lg"
                        style={{ height: barHeights.Aspirin }}
                      ></div>
                    </div>
                  </div>

                  {/* Column 2: Lisinopril */}
                  <div className="w-12 h-full flex flex-col justify-end items-center group relative">
                    <div className="absolute top-[-22px] bg-slate-955 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      {barHeights.counts[1]} missed
                    </div>
                    <div
                      className="w-full bg-primary/20 dark:bg-slate-805 border border-slate-200 dark:border-slate-800 rounded-t-lg overflow-hidden flex items-end"
                      style={{ height: '80%' }}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-primary to-indigo-500 transition-all duration-500 ease-out origin-bottom rounded-t-lg"
                        style={{ height: barHeights.Lisinopril }}
                      ></div>
                    </div>
                  </div>

                  {/* Column 3: Metformin */}
                  <div className="w-12 h-full flex flex-col justify-end items-center group relative">
                    <div className="absolute top-[-22px] bg-slate-955 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      {barHeights.counts[2]} missed
                    </div>
                    <div
                      className="w-full bg-primary/20 dark:bg-slate-805 border border-slate-200 dark:border-slate-800 rounded-t-lg overflow-hidden flex items-end"
                      style={{ height: '80%' }}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-primary to-indigo-500 transition-all duration-500 ease-out origin-bottom rounded-t-lg"
                        style={{ height: barHeights.Metformin }}
                      ></div>
                    </div>
                  </div>

                  {/* Column 4: Statin */}
                  <div className="w-12 h-full flex flex-col justify-end items-center group relative">
                    <div className="absolute top-[-22px] bg-slate-955 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                      {barHeights.counts[3]} missed
                    </div>
                    <div
                      className="w-full bg-primary/20 dark:bg-slate-805 border border-slate-200 dark:border-slate-800 rounded-t-lg overflow-hidden flex items-end"
                      style={{ height: '80%' }}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-primary to-indigo-500 transition-all duration-500 ease-out origin-bottom rounded-t-lg"
                        style={{ height: barHeights.Statin }}
                      ></div>
                    </div>
                  </div>

                  {/* X Axis Labels */}
                  <div className="absolute bottom-[-20px] left-4 right-0 flex justify-around text-[9px] text-slate-400 font-semibold font-mono">
                    <span className="w-12 text-center truncate">Aspirin</span>
                    <span className="w-12 text-center truncate">Lisinopril</span>
                    <span className="w-12 text-center truncate">Metformin</span>
                    <span className="w-12 text-center truncate">Statin</span>
                  </div>
                </div>
              </Card>

            </div>

            {/* Performance & AI Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Medication Performance List */}
              <Card variant="glass" className="lg:col-span-1 p-5 flex flex-col gap-4 bg-white dark:bg-slate-900 text-left">
                <h3 className="text-sm font-bold text-slate-805 dark:text-white mb-1">Medication Performance</h3>

                {/* Item 1 */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-355">Paracetamol</span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">92%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: '92%' }}></div>
                  </div>
                </div>

                {/* Item 2 */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-355">Amoxicillin</span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">81%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: '81%' }}></div>
                  </div>
                </div>

                {/* Item 3 */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-355">Levothyroxine</span>
                    <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">65%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </Card>

              {/* AI Diagnostic Insight Card */}
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
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                    RxEaseAI detected missed doses are highest in the <strong className="text-indigo-500 dark:text-indigo-400 font-bold">evening schedule</strong> (between 18:00 - 21:00). Patient compliance demographic models suggest fatigue-related non-compliance issues.
                  </p>
                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-500 max-w-sm">Recommendation: Adjust reminder timings to align with standard dinner routines.</span>
                    <Button
                      variant={optApplied ? "outline" : "primary"}
                      onClick={handleApplyOptimization}
                      disabled={optApplied}
                      className={`text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${optApplied ? 'bg-slate-100 dark:bg-slate-800 opacity-60 text-slate-455' : 'bg-indigo-600 hover:bg-indigo-550 text-white shadow-md'}`}
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

            {/* Detailed Compliance Log Table */}
            <Card variant="glass" className="overflow-hidden border border-slate-200 dark:border-slate-805 shadow-md bg-white dark:bg-slate-900">
              <div className="p-5 border-b border-slate-200/60 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white text-left">Compliance Log</h3>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-48">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search drug..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-slate-800 dark:text-slate-105 animate-none"
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

              {/* Table wrapper */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/30 text-slate-455 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-850">
                      <th className="px-6 py-4 font-bold">Medicine</th>
                      <th className="px-6 py-4 font-bold">Scheduled Times</th>
                      <th className="px-6 py-4 font-bold text-center">Taken Doses</th>
                      <th className="px-6 py-4 font-bold text-center">Missed Doses</th>
                      <th className="px-6 py-4 font-bold text-right">Adherence Rate</th>
                      <th className="px-6 py-4 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-850/80">
                    <AnimatePresence mode="wait">
                      {paginatedLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{log.medicine}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{log.scheduled}</td>
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
                    </AnimatePresence>
                    {paginatedLogs.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-455 dark:text-slate-500">
                          <MaterialIcon name="filter_list_off" size="2xl" className="mb-2 opacity-50" />
                          <div>No logs found matching selection.</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table pagination footer */}
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

        </div>
      </div>
    </div>
  );
}
