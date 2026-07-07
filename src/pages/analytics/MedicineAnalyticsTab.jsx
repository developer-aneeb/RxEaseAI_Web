import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { analyticsService } from '../../services/analyticsService';
import { Pill, Activity, Calendar, Clock, BarChart3, HelpCircle, ShieldAlert } from 'lucide-react';

export default function MedicineAnalyticsTab({ remindersList = [] }) {
  const [selectedId, setSelectedId] = useState('');
  const [days, setDays] = useState(30);
  const [medicineData, setMedicineData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedicineSpecificData = async (id, filterDays) => {
    if (!id) {
      setMedicineData(null);
      return;
    }
    setIsLoading(true);
    try {
      const response = await analyticsService.getMedicineAnalytics(id, filterDays);
      setMedicineData(response?.data || null);
    } catch (error) {
      console.error('Error fetching medicine-specific analytics:', error);
      setMedicineData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicineSpecificData(selectedId, days);
  }, [selectedId, days]);

  const activeReminders = remindersList.filter(r => r.isActive);

  return (
    <Card variant="glass" className="p-6 text-left bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-805">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4 mb-5">
        <div>
          <h3 className="text-base font-extrabold text-slate-855 dark:text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" /> Medicine-Specific Compliance Analyzer
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Analyze precise adherence histories, dosage skipped counts and trends per prescription profile.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Medicine Selector Dropdown */}
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-slate-105 font-bold cursor-pointer max-w-xs"
          >
            <option value="">Select a Medicine...</option>
            {activeReminders.map((rem) => (
              <option key={rem.id} value={rem.id}>
                {rem.medicineName} {rem.dosage ? `(${rem.dosage})` : ''}
              </option>
            ))}
          </select>

          {/* Time range selector */}
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            disabled={!selectedId}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-slate-105 font-bold cursor-pointer disabled:opacity-40"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Main Panel Content */}
      {isLoading ? (
        <div className="py-16 flex justify-center items-center">
          <Spinner />
        </div>
      ) : medicineData ? (
        <div className="space-y-6 animate-fade-in">
          {/* Adherence Rate & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Adherence rate gauge */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/15 border border-indigo-100/60 dark:border-indigo-900/30 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Therapeutic Compliance</span>
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200 dark:text-slate-850" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                  <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${medicineData.summary?.adherenceRate || 0}, 100`} strokeLinecap="round" strokeWidth="3.5"></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-855 dark:text-white">{Math.round(medicineData.summary?.adherenceRate || 0)}%</span>
                  <span className="text-[9px] text-slate-450 uppercase font-bold mt-0.5">Adherence</span>
                </div>
              </div>
            </div>

            {/* Totals Grid */}
            <div className="md:col-span-3 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Doses Scheduled</span>
                <span className="text-2xl font-black text-slate-800 dark:text-white mt-2">{medicineData.summary?.due || 0}</span>
              </div>
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/10 dark:bg-emerald-950/5 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Taken On Time</span>
                <span className="text-2xl font-black text-emerald-500 mt-2">{medicineData.summary?.taken || 0}</span>
              </div>
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/10 dark:bg-amber-950/5 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Doses Skipped</span>
                <span className="text-2xl font-black text-amber-500 mt-2">{medicineData.summary?.skipped || 0}</span>
              </div>
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/30 bg-rose-50/10 dark:bg-rose-950/5 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Doses Missed</span>
                <span className="text-2xl font-black text-rose-500 mt-2">{medicineData.summary?.missed || 0}</span>
              </div>
            </div>
          </div>

          {/* Daily Trend List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-primary" /> Adherence Trend Over Last {days} Days
            </h4>
            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2">
              {medicineData.dailyTrend?.length > 0 ? medicineData.dailyTrend.map((t, idx) => {
                const total = (t.taken || 0) + (t.skipped || 0) + (t.missed || 0);
                const isMissed = t.missed > 0;
                const isSkipped = t.skipped > 0;
                return (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-500">
                        {t.taken} taken {isSkipped ? `• ${t.skipped} skipped` : ''} {isMissed ? `• ${t.missed} missed` : ''}
                      </span>
                      {t.taken > 0 && (
                        <Badge variant="primary" className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-550/20">Taken</Badge>
                      )}
                      {t.skipped > 0 && (
                        <Badge variant="secondary" className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-550/20">Skipped</Badge>
                      )}
                      {t.missed > 0 && (
                        <Badge variant="tertiary" className="text-[9px] bg-rose-500/10 text-rose-500 border border-rose-550/20">Missed</Badge>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <p className="text-xs text-slate-500 py-4 text-center">No trend details recorded in this date range.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-slate-455 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Pill className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Medicine Selected</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Choose an active medication from the dropdown selection above to analyze its specific dosage compliance history.
          </p>
        </div>
      )}
    </Card>
  );
}
