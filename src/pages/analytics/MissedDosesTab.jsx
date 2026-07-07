import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Clock, AlertTriangle, Calendar, Pill } from 'lucide-react';

export default function MissedDosesTab({ data }) {
  const byTimeOfDay = data?.patterns?.byTimeOfDay || {};
  const byDayOfWeek = data?.patterns?.byDayOfWeek || {};
  const byMedicine = data?.patterns?.byMedicine || [];
  const recentMissed = data?.recentMissed || [];

  const maxTimeVal = Math.max(...Object.values(byTimeOfDay), 1);
  const maxDayVal = Math.max(...Object.values(byDayOfWeek), 1);

  return (
    <div className="space-y-6 text-left">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time of Day Patterns */}
        <Card variant="glass" className="p-6 border-rose-500/20 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-500" /> Missed Doses by Time of Day
          </h3>
          <div className="space-y-4">
            {Object.entries(byTimeOfDay).map(([time, count]) => (
              <div key={time} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="capitalize text-slate-700 dark:text-slate-400">{time}</span>
                  <span className="font-bold text-rose-500">{count} missed</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-850">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(count / maxTimeVal) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {Object.keys(byTimeOfDay).length === 0 && (
              <p className="text-xs text-slate-450 py-4">No time-of-day compliance patterns available.</p>
            )}
          </div>
        </Card>

        {/* Day of Week Patterns */}
        <Card variant="glass" className="p-6 border-amber-500/20 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-855 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" /> Missed Doses by Day of Week
          </h3>
          <div className="space-y-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
              const count = byDayOfWeek[day] || 0;
              return (
                <div key={day} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-400">{day}</span>
                    <span className="font-bold text-amber-500">{count} missed</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-850">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(count / maxDayVal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Medicine breakdown */}
        <Card variant="glass" className="p-6 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 flex items-center gap-2">
            <Pill className="w-4 h-4 text-indigo-500" /> Misses by Medication Profile
          </h3>
          <div className="space-y-3">
            {byMedicine.map((med, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{med.medicine}</span>
                <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-lg">
                  {med.count} Missed
                </span>
              </div>
            ))}
            {byMedicine.length === 0 && (
              <p className="text-xs text-slate-500 py-6 text-center">No compliance violations logged.</p>
            )}
          </div>
        </Card>

        {/* Recent Missed Doses */}
        <Card variant="glass" className="p-6 border-rose-500/15 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-855 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Recent Missed Doses Log
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {recentMissed.length > 0 ? recentMissed.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.medicineName}</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    📅 {new Date(item.scheduledTime).toLocaleString()}
                  </span>
                </div>
                <Badge variant="tertiary" className="text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20">
                  Missed
                </Badge>
              </div>
            )) : (
              <p className="text-xs text-slate-500 py-6 text-center">Perfect Adherence! No missed doses logged.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
