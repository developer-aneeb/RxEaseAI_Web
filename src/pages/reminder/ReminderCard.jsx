import React, { useState } from 'react';
import { Clock, CheckCircle2, MoreVertical, Edit2, Trash2, Bell, AlertCircle, Calendar, Repeat, ArrowRight, ShieldAlert, Check } from 'lucide-react';

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ReminderCard({ item, onTakeAction, onSnooze, onEdit, onDelete, formatTime }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);

  // Determine status display
  const isInactive = item.is_active === false;
  const isTaken = item.last_action === 'take' || item.status === 'taken' || item.status === 'completed';
  const isSkipped = item.last_action === 'skip' || item.status === 'skipped';

  const getStatusBadge = () => {
    if (isInactive) {
      return (
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
          <span>Inactive / Done</span>
        </span>
      );
    }
    if (isTaken) {
      return (
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shadow-sm">
          <Check className="w-3 h-3" />
          <span>Taken</span>
        </span>
      );
    }
    if (isSkipped) {
      return (
        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
          <span>Skipped</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light border border-primary/20 flex items-center gap-1 animate-pulse shadow-sm">
        <Bell className="w-3 h-3" />
        <span>Active / Due</span>
      </span>
    );
  };

  const getScheduleText = () => {
    if (item.schedule_type === 'once') return 'One-time only';
    if (item.schedule_type === 'daily') return 'Daily (Every 24 hours)';
    if (item.schedule_type === 'monthly') return 'Monthly schedule';
    if (item.schedule_type === 'weekly' && Array.isArray(item.weekdays)) {
      const days = item.weekdays.map(d => WEEKDAY_NAMES[d] || d).join(', ');
      return `Weekly on ${days || 'selected days'}`;
    }
    return 'Regular schedule';
  };

  return (
    <div className="relative flex items-start gap-6 group">
      {/* Timeline Node */}
      <div className={`absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
        isTaken ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30' : isInactive ? 'bg-slate-300 dark:bg-slate-700 border-slate-400' : 'bg-white dark:bg-slate-900 border-primary'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isTaken ? 'bg-white' : isInactive ? 'bg-slate-500' : 'bg-primary animate-ping'}`} />
      </div>

      {/* Main Card */}
      <div className={`flex-1 p-5 rounded-2xl shadow-sm border transition-all duration-200 ${
        isTaken
          ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200/60 dark:border-emerald-900/30 hover:shadow-md'
          : isInactive
          ? 'bg-slate-100/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-75'
          : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:shadow-md hover:border-primary/40'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          {/* Left Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="font-extrabold text-slate-850 dark:text-white text-base tracking-tight hover:text-primary transition-colors">
                {item.medicine_name}
              </h4>
              {getStatusBadge()}
              {item.dosage && (
                <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                  💊 {item.dosage}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium pt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Time: {formatTime(item.next_trigger_at || item.start_at)}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Repeat className="w-3.5 h-3.5 text-slate-400" />
                {getScheduleText()}
              </span>
              {item.remind_count > 1 && (
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                  Alert cycle: {item.remind_count}x (every {item.remind_interval_minutes}m)
                </span>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 relative">
            {/* Take Button */}
            {!isTaken && !isInactive && (
              <button
                onClick={() => onTakeAction(item.id, 'take')}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border-0 active:scale-95"
                title="Mark dose as taken"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Take Dose</span>
              </button>
            )}

            {/* Snooze Menu Button */}
            {!isInactive && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSnoozeMenu(!showSnoozeMenu);
                    setShowMenu(false);
                  }}
                  className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-xl transition-colors border-0 cursor-pointer flex items-center gap-1"
                  title="Snooze reminder"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Snooze</span>
                </button>

                {showSnoozeMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-30 animate-scale-up">
                    <div className="text-[9px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">Snooze For</div>
                    {[
                      { label: '10 Minutes', mins: 10 },
                      { label: '30 Minutes', mins: 30 },
                      { label: '1 Hour', mins: 60 },
                      { label: '2 Hours', mins: 120 }
                    ].map((opt) => (
                      <button
                        key={opt.mins}
                        onClick={() => {
                          onSnooze(item.id, opt.mins);
                          setShowSnoozeMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Skip Button */}
            {!isSkipped && !isTaken && !isInactive && (
              <button
                onClick={() => onTakeAction(item.id, 'skip')}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-600 dark:text-slate-300 hover:text-amber-600 rounded-xl transition-colors border-0 cursor-pointer"
                title="Skip this dose"
              >
                <span className="text-[10px] font-bold px-1">Skip</span>
              </button>
            )}

            {/* Edit Button */}
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border-0 bg-transparent cursor-pointer"
              title="Edit schedule"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* More Options / Delete Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMenu(!showMenu);
                  setShowSnoozeMenu(false);
                }}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border-0 bg-transparent cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-30 min-w-[140px] animate-scale-up">
                  {isInactive ? (
                    <button
                      onClick={() => {
                        onTakeAction(item.id, 'take');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg border-0 bg-transparent cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Active / Take</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onTakeAction(item.id, 'skip');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg border-0 bg-transparent cursor-pointer flex items-center gap-2"
                    >
                      <span>Skip Dose Today</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onDelete(item.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg border-0 bg-transparent cursor-pointer flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Schedule</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
