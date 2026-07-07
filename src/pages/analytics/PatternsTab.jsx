import React from 'react';
import Card from '../../components/ui/Card';
import { TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export default function PatternsTab({ consistency, patterns }) {
  const { summary: consSummary, message: consMsg } = consistency || {};
  const { weekdayAdherence, message: patMsg } = patterns || {};

  return (
    <div className="space-y-6 text-left">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-5 text-left bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Schedules Tracked</h3>
          <div className="text-3xl font-black text-slate-800 dark:text-white">{consSummary?.daysTracked || 0} Days</div>
        </Card>
        <Card variant="glass" className="p-5 text-left bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Doses Tracked</h3>
          <div className="text-3xl font-black text-slate-800 dark:text-white">{consSummary?.totalScheduled || 0} Doses</div>
        </Card>
        <Card variant="glass" className="p-5 text-left bg-gradient-to-br from-primary/5 to-emerald-500/5 border-emerald-500/20">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Consistency</h3>
          <div className="text-3xl font-black text-primary">{consSummary?.adherenceRate || 0}%</div>
        </Card>
      </div>

      {/* Advice / Disclaimer Banners (No gamification policy) */}
      <Card variant="glass" className="p-4 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-850 dark:text-white">Clinical Compliance Disclaimer</h4>
          <p className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed">
            {consMsg || "Neutral adherence tracking without judgment. Discuss any concerns with your healthcare provider."}
          </p>
        </div>
      </Card>

      {/* Weekday patterns list */}
      <Card variant="glass" className="p-6 bg-white dark:bg-slate-900">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Weekly Adherence Consistency Patterns
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {patMsg || "This data helps identify routine disruptions. Use it to plan better, not for self-judgment."}
          </p>
        </div>

        <div className="space-y-5">
          {weekdayAdherence?.length > 0 ? weekdayAdherence.map((day) => (
            <div key={day.day} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-350">{day.day}</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {day.adherenceRate}% ({day.taken}/{day.scheduled} taken)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-850">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    day.adherenceRate >= 90 ? 'bg-emerald-500' : day.adherenceRate >= 70 ? 'bg-primary' : 'bg-rose-500'
                  }`}
                  style={{ width: `${day.adherenceRate}%` }}
                ></div>
              </div>
            </div>
          )) : (
            <p className="text-xs text-slate-500 py-6 text-center">No compliance log records available to draw patterns.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
