import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { BellRing, Calendar, Clock, Activity, CheckCircle, HelpCircle } from 'lucide-react';

export default function RemindersTab({ data }) {
  const { summary, reminders = [] } = data || {};
  const byScheduleType = summary?.byScheduleType || {};
  const byTimeOfDay = summary?.byTimeOfDay || {};

  const maxTimeVal = Math.max(...Object.values(byTimeOfDay), 1);

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Status Card */}
        <Card variant="glass" className="p-5 flex flex-col justify-between bg-white dark:bg-slate-900 min-h-[140px]">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-primary" /> Medication Status Summary
          </h3>
          <div className="flex justify-around items-center py-2">
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-500">{summary?.active || 0}</div>
              <div className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-slate-400">{summary?.inactive || 0}</div>
              <div className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">Inactive</div>
            </div>
          </div>
        </Card>

        {/* Schedule Type Card */}
        <Card variant="glass" className="p-5 flex flex-col justify-between bg-white dark:bg-slate-900 min-h-[140px]">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" /> By Schedule Frequency
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.keys(byScheduleType).length > 0 ? Object.entries(byScheduleType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-lg">
                <span className="font-semibold text-slate-700 dark:text-slate-450 capitalize truncate">{type}</span>
                <span className="font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded text-[10px]">{count}</span>
              </div>
            )) : (
              <div className="col-span-2 text-center text-slate-400 py-3">No schedule details.</div>
            )}
          </div>
        </Card>

        {/* Trigger Time breakdown */}
        <Card variant="glass" className="p-5 flex flex-col justify-between bg-white dark:bg-slate-900 min-h-[140px]">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Distribution by Time of Day
          </h3>
          <div className="space-y-1.5">
            {Object.entries(byTimeOfDay).map(([time, count]) => (
              <div key={time} className="flex items-center gap-2 text-[10px]">
                <span className="capitalize font-semibold text-slate-655 dark:text-slate-400 w-12">{time}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(count / maxTimeVal) * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-slate-700 dark:text-white w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reminders List Table */}
      <Card variant="glass" className="overflow-hidden border border-slate-200 dark:border-slate-805 shadow-md bg-white dark:bg-slate-900">
        <div className="p-5 border-b border-slate-200/60 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Active Medication Directory</h3>
          <p className="text-xs text-slate-500 mt-1">Full database of configured schedules, dosages and time triggers.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/30 text-slate-455 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-850">
                <th className="px-6 py-4">Medication Name</th>
                <th className="px-6 py-4">Dosage / Meal timing</th>
                <th className="px-6 py-4 text-center">Frequency</th>
                <th className="px-6 py-4 text-center">Time of Day</th>
                <th className="px-6 py-4 text-right">Start Date</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-850/80">
              {reminders.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-100">{r.medicineName}</td>
                  <td className="px-6 py-4 text-slate-655 dark:text-slate-400 font-semibold">{r.dosage || 'Not Specified'}</td>
                  
                  <td className="px-6 py-4 text-center">
                    <span className="capitalize bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-500/20">
                      {r.scheduleType}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-750">
                      🌅 {r.timeOfDay}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-slate-550 dark:text-slate-450">
                    {r.startAt ? new Date(r.startAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Continuous'}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      r.isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-550 border-slate-200 dark:border-slate-750'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${r.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      <span>{r.isActive ? 'Active' : 'Inactive'}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {reminders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <BellRing className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div>No medication records found. Configure a reminder to see analytics database.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
