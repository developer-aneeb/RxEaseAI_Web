import React from 'react';
import { Calendar, Clock, Stethoscope, Activity, FileText, Edit2, Trash2, Check, RefreshCw, Loader2 } from 'lucide-react';

export default function FollowUpCard({ item, onEdit, onDelete, onRefill, isRefilling }) {
  const getTypeBadge = () => {
    switch (item.reminder_type) {
      case 'revisit':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 shrink-0">
            <span>🩺 Doctor Revisit</span>
          </span>
        );
      case 'lab_test':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1 shrink-0">
            <span>🧪 Lab Diagnostics</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
            <span>💊 Prescription / General</span>
          </span>
        );
    }
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return 'No time scheduled';
    try {
      const dt = new Date(isoStr);
      return dt.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' +
             dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-md hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3">
      <div className="space-y-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-extrabold text-slate-850 dark:text-white text-sm truncate">
            {item.title}
          </h4>
          {getTypeBadge()}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            {formatDateTime(item.scheduled_at)}
          </span>
        </div>

        {item.notes && (
          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg border border-slate-100 dark:border-slate-800 mt-1 line-clamp-2">
            📝 {item.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {/* Quick Action (Refill or Complete) */}
        {item.reminder_type === 'general' ? (
          <button
            onClick={() => onRefill(item.id)}
            disabled={isRefilling}
            className="text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border-0"
            title="Place refill order"
          >
            {isRefilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Refill Now</span>
          </button>
        ) : (
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer border-0"
            title="Mark event completed"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Complete</span>
          </button>
        )}

        {/* Edit */}
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
          title="Edit event"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
          title="Delete event"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
