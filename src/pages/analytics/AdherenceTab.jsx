import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { BellRing, CheckCircle, AlertTriangle, Sparkles, Search, Filter as FilterIcon, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function AdherenceTab({
  adherenceData,
  logs,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  optApplied,
  handleApplyOptimization
}) {
  const stats = {
    total: adherenceData?.summary?.totalDoses || 0,
    taken: adherenceData?.summary?.takenDoses || 0,
    skipped: adherenceData?.summary?.skippedDoses || 0,
    missed: adherenceData?.summary?.missedDoses || 0,
    rate: Math.round(adherenceData?.summary?.adherenceRate || 0)
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.date.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 text-left">
      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden bg-white/70 dark:bg-slate-900/80">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Doses Due</h3>
            <BellRing className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-white">{stats.total}</div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden bg-white/70 dark:bg-slate-900/80">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taken</h3>
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-white">{stats.taken}</div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden bg-white/70 dark:bg-slate-900/80">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skipped</h3>
            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <span className="material-symbols-outlined text-[16px]">visibility_off</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-white">{stats.skipped}</div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden bg-white/70 dark:bg-slate-900/80">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Missed Doses</h3>
            <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800 dark:text-white">{stats.missed}</div>
          </div>
        </Card>

        <Card variant="glass" className="p-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden bg-gradient-to-br from-indigo-50/40 via-purple-50/40 to-emerald-50/10 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-slate-900/80 border border-indigo-500/20 shadow-md">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">Adherence Rate</h3>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <div className="text-3xl font-black text-slate-855 dark:text-white">{stats.rate}%</div>
              <div className="text-[10px] text-indigo-500 font-semibold mt-1">Target: 95%</div>
            </div>
            <div className="relative w-9 h-9 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-200 dark:text-slate-850" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                <path className="text-indigo-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats.rate}, 100`} strokeLinecap="round" strokeWidth="4"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">{stats.rate}%</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance List */}
        <Card variant="glass" className="lg:col-span-1 p-5 flex flex-col gap-4 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Compliance Trends</h3>
          <div className="space-y-4">
            {logs.slice(0, 4).map((l, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{l.date}</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${l.adherence >= 90
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : l.adherence >= 70
                        ? 'text-primary bg-primary/10'
                        : 'text-rose-500 bg-rose-500/10'
                    }`}>{l.adherence}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${l.adherence >= 90 ? 'bg-emerald-500' : l.adherence >= 70 ? 'bg-primary' : 'bg-rose-500'
                      }`}
                    style={{ width: `${l.adherence}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-xs text-slate-400 py-6">No performance metrics recorded.</p>
            )}
          </div>
        </Card>

        {/* AI Insight Card */}
        <Card variant="glass" className="lg:col-span-2 p-6 flex flex-col md:flex-row gap-5 items-start bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-slate-900 border border-indigo-500/20">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 relative z-10 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">AI Medication Routine Analysis</span>
              <Badge variant="tertiary" className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/25">High Confidence</Badge>
            </div>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
              RxEaseAI analyzed your compliance logs and detected adherence spikes near meal schedules. We recommend matching reminder timings directly with meals to optimize therapeutic efficacy.
            </p>
            <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="text-[10px] text-slate-500 max-w-sm">Recommendation: Adjust reminder timings to align with standard dinner routines.</span>
              <Button
                variant={optApplied ? "outline" : "primary"}
                onClick={handleApplyOptimization}
                disabled={optApplied}
                className={`text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${optApplied ? 'bg-slate-100 dark:bg-slate-800 opacity-60 text-slate-455 border-slate-250' : 'bg-indigo-650 hover:bg-indigo-600 text-white shadow-md border-0'
                  }`}
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

      {/* Compliance Log Table */}
      <Card variant="glass" className="overflow-hidden border border-slate-200 dark:border-slate-805 shadow-md bg-white dark:bg-slate-900">
        <div className="p-5 border-b border-slate-200/60 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Compliance Log</h3>
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
                <option value="Optimal">Optimal (≥90%)</option>
                <option value="Acceptable">Acceptable (70-89%)</option>
                <option value="Flagged">Flagged (≤70%)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/30 text-slate-455 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-850">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Scheduled</th>
                <th className="px-6 py-4 text-center border-l border-slate-100 dark:border-slate-850 bg-emerald-50/10 dark:bg-emerald-950/5">Taken</th>
                <th className="px-6 py-4 text-center border-l border-slate-100 dark:border-slate-850 bg-amber-50/10 dark:bg-amber-950/5">Skipped</th>
                <th className="px-6 py-4 text-center border-l border-slate-100 dark:border-slate-850 bg-rose-50/10 dark:bg-rose-950/5">Missed</th>
                <th className="px-6 py-4 text-right border-l border-slate-100 dark:border-slate-850">Adherence</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-850/80">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-100">{log.date}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{log.scheduled} doses</td>

                  <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200 border-l border-slate-100 dark:border-slate-850 bg-emerald-50/10 dark:bg-emerald-950/5">
                    {log.taken}
                  </td>

                  <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200 border-l border-slate-100 dark:border-slate-850 bg-amber-50/10 dark:bg-amber-950/5">
                    {log.skipped}
                  </td>

                  <td className={`px-6 py-4 text-center border-l border-slate-100 dark:border-slate-850 bg-rose-50/10 dark:bg-rose-950/5 ${log.missed > 0 ? 'text-rose-500 font-bold' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                    {log.missed}
                  </td>

                  <td className={`px-6 py-4 text-right font-bold border-l border-slate-100 dark:border-slate-850 ${log.adherence >= 90 ? 'text-emerald-500' : log.adherence >= 70 ? 'text-primary' : 'text-rose-500'
                    }`}>{log.adherence}%</td>

                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${log.status === 'Optimal'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
                        : log.status === 'Acceptable'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                      <span className={`w-1 h-1 rounded-full ${log.status === 'Optimal' ? 'bg-emerald-500' : log.status === 'Acceptable' ? 'bg-primary' : 'bg-rose-500'
                        }`}></span>
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <span className="material-symbols-outlined text-[24px] mb-2 opacity-50">filter_list_off</span>
                    <div>No compliance log entries found matching filter conditions.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200/50 dark:border-slate-855 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
          <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
            Showing {paginatedLogs.length} of {filteredLogs.length} days
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
