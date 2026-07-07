import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import { useAuthStore } from '../../../store/useAuthStore';
import Navbar from '../../../components/layout/Navbar';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import { FileText, Clock, CheckCircle2, AlertTriangle, TrendingUp, BarChart3, Pill } from 'lucide-react';
import { analyticsService } from '../../../services/analyticsService';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';

export default function PrescriptionAnalytics() {
  const showToast = useAppStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await analyticsService.getPrescriptionStats(12); // Fetch last 12 months
        setStats(response?.data || null);
      } catch (error) {
        console.error(error);
        showToast(getFriendlyErrorMessage(error, 'Failed to fetch prescription analytics.'), 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [showToast]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Search', href: '#search' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Reminders', href: '#reminders' },
    { name: 'Notifications', href: '#notifications' },
  ];

  const summary = stats?.summary || { total: 0, avgProcessingMinutes: 0, statusBreakdown: {} };
  const monthlyTrend = stats?.monthlyTrend || [];

  // Determine max for bar scaling
  const maxMonthlyUploads = Math.max(...monthlyTrend.map(m => m.total), 1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">
        <div className="flex flex-col gap-8 animate-fade-up">

          {/* Header section */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-wider text-[10px] mb-4 backdrop-blur-md">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Prescription Analytics Workspace</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Prescription <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Analytics</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
              Track your upload trends, processing efficiency, and ingestion status breakdowns over time.
            </p>
          </div>

          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Spinner />
              <p className="text-xs text-slate-400 animate-pulse">Loading analytics...</p>
            </div>
          ) : !stats ? (
            <Card className="p-12 text-center border-dashed border-2">
              <p className="text-slate-500">No prescription data available.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">

              {/* Summary Cards */}
              <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card variant="glass" className="p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Uploads</span>
                      <h2 className="text-4xl font-black text-slate-800 dark:text-white mt-2">{summary.total}</h2>
                    </div>
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Processing Time</span>
                      <h2 className="text-4xl font-black text-slate-800 dark:text-white mt-2">
                        {summary.avgProcessingMinutes} <span className="text-sm text-slate-500 font-medium">min</span>
                      </h2>
                    </div>
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processed & Verified</span>
                      <h2 className="text-4xl font-black text-slate-800 dark:text-white mt-2">
                        {summary.statusBreakdown?.processed || 0}
                      </h2>
                    </div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Status Breakdown & Monthly Trend */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <Card variant="glass" className="p-6">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Processing Status
                  </h3>

                  <div className="space-y-4">
                    {[
                      { label: 'Processed', value: summary.statusBreakdown?.processed || 0, color: 'bg-emerald-500' },
                      { label: 'Processing', value: summary.statusBreakdown?.processing || 0, color: 'bg-indigo-500' },
                      { label: 'Uploaded', value: summary.statusBreakdown?.uploaded || 0, color: 'bg-slate-400' },
                      { label: 'Failed', value: summary.statusBreakdown?.failed || 0, color: 'bg-rose-500' },
                    ].map((stat, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                          <span>{stat.label}</span>
                          <span>{stat.value}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-full ${stat.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${summary.total > 0 ? (stat.value / summary.total) * 100 : 0}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-6">
                <Card variant="glass" className="p-6">
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <Pill className="w-4 h-4 text-primary" /> Upload Trends
                    </h3>
                  </div>

                  <div className="h-64 flex items-end gap-2 sm:gap-4 justify-between border-b border-slate-200 dark:border-slate-800 pb-2 relative">
                    {/* Y-axis guidelines */}
                    <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-t border-slate-200 dark:border-slate-800/50 w-full h-0"></div>
                      <div className="border-t border-slate-200 dark:border-slate-800/50 w-full h-0"></div>
                      <div className="border-t border-slate-200 dark:border-slate-800/50 w-full h-0"></div>
                    </div>

                    {monthlyTrend.length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-400">
                        Not enough data for trend analysis
                      </div>
                    ) : (
                      monthlyTrend.map((monthData, i) => (
                        <div key={i} className="flex flex-col items-center justify-end h-full flex-1 group z-10">
                          {/* Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-lg">
                            {monthData.total} Uploads
                          </div>

                          {/* Bar */}
                          <motion.div
                            className="w-full max-w-[40px] bg-gradient-to-t from-primary/50 to-primary rounded-t-lg transition-all group-hover:from-primary group-hover:to-indigo-400"
                            initial={{ height: 0 }}
                            animate={{ height: `${(monthData.total / maxMonthlyUploads) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                          ></motion.div>

                          {/* Label */}
                          <div className="text-[10px] text-slate-500 font-bold mt-3 -rotate-45 sm:rotate-0 whitespace-nowrap">
                            {new Date(monthData.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
