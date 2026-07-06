import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reminderSchema } from '../../utils/validation/zodSchemas';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { BellRing, Calendar, Clock, Repeat, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

const WEEKDAYS = [
  { id: 1, label: 'Mon', short: 'M' },
  { id: 2, label: 'Tue', short: 'T' },
  { id: 3, label: 'Wed', short: 'W' },
  { id: 4, label: 'Thu', short: 'T' },
  { id: 5, label: 'Fri', short: 'F' },
  { id: 6, label: 'Sat', short: 'S' },
  { id: 0, label: 'Sun', short: 'S' },
];

export default function ReminderModal({ isOpen, onClose, onSave, initialData, isSaving }) {
  const isEditMode = Boolean(initialData?.id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      medicine_name: '',
      dosage: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      schedule_type: 'daily',
      weekdays: [1, 3, 5],
      remind_count: 1,
      remind_interval_minutes: 10,
      meal: 'Breakfast'
    }
  });

  const selectedSchedule = watch('schedule_type');
  const selectedWeekdays = watch('weekdays') || [];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Parse date and time from start_at ISO string
        let dateStr = new Date().toISOString().split('T')[0];
        let timeStr = '09:00';
        if (initialData.start_at) {
          try {
            const dt = new Date(initialData.start_at);
            dateStr = dt.toISOString().split('T')[0];
            timeStr = dt.toTimeString().slice(0, 5);
          } catch (e) {
            console.error('Date parsing error:', e);
          }
        }

        // Parse meal from dosage if present (e.g., "10mg (Breakfast)")
        let rawDosage = initialData.dosage || '';
        let extractedMeal = 'Breakfast';
        const mealMatch = rawDosage.match(/\((Breakfast|Lunch|Dinner|Before Sleep|Anytime)\)$/i);
        if (mealMatch) {
          extractedMeal = mealMatch[1];
          rawDosage = rawDosage.replace(/\s*\((Breakfast|Lunch|Dinner|Before Sleep|Anytime)\)$/i, '').trim();
        }

        reset({
          medicine_name: initialData.medicine_name || '',
          dosage: rawDosage,
          date: dateStr,
          time: timeStr,
          schedule_type: initialData.schedule_type || 'daily',
          weekdays: Array.isArray(initialData.weekdays) ? initialData.weekdays : [1, 3, 5],
          remind_count: initialData.remind_count || 1,
          remind_interval_minutes: initialData.remind_interval_minutes || 10,
          meal: extractedMeal
        });
      } else {
        reset({
          medicine_name: '',
          dosage: '',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          schedule_type: 'daily',
          weekdays: [1, 3, 5],
          remind_count: 1,
          remind_interval_minutes: 10,
          meal: 'Breakfast'
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const toggleWeekday = (dayId) => {
    if (selectedWeekdays.includes(dayId)) {
      setValue('weekdays', selectedWeekdays.filter(id => id !== dayId), { shouldValidate: true });
    } else {
      setValue('weekdays', [...selectedWeekdays, dayId].sort(), { shouldValidate: true });
    }
  };

  const handleFormSubmit = (data) => {
    // Combine date and time into start_at ISO
    const startAtISO = new Date(`${data.date}T${data.time || '09:00'}:00`).toISOString();
    
    // Combine dosage and meal timing nicely
    const formattedDosage = data.dosage ? `${data.dosage.trim()} (${data.meal})` : `(${data.meal})`;

    const payload = {
      medicine_name: data.medicine_name.trim(),
      dosage: formattedDosage,
      schedule_type: data.schedule_type,
      start_at: startAtISO,
      remind_count: Number(data.remind_count) || 1,
      remind_interval_minutes: Number(data.remind_interval_minutes) || 10
    };

    if (data.schedule_type === 'weekly') {
      payload.weekdays = data.weekdays || [1];
    }

    onSave(payload, initialData?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
          <BellRing className="w-5 h-5 text-primary" />
          {isEditMode ? 'Edit Medicine Reminder' : 'Schedule New Reminder'}
        </span>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 text-left font-sans">
        {/* Medicine Name & Dosage Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Medicine Name *"
            placeholder="e.g. Lisinopril, Amoxicillin"
            error={errors.medicine_name?.message}
            {...register('medicine_name')}
          />
          <Input
            label="Dosage Amount"
            placeholder="e.g. 10mg, 1 tablet, 2 drops"
            error={errors.dosage?.message}
            {...register('dosage')}
          />
        </div>

        {/* Schedule Type & Meal Timing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Frequency Schedule *
            </label>
            <select
              {...register('schedule_type')}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary font-medium"
            >
              <option value="daily">Daily Schedule (Every 24h)</option>
              <option value="weekly">Weekly (Selected Days)</option>
              <option value="monthly">Monthly (Same Date)</option>
              <option value="once">One-time Only</option>
            </select>
            {errors.schedule_type && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.schedule_type.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Meal Timing Preference
            </label>
            <select
              {...register('meal')}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary font-medium"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Before Sleep">Before Sleep</option>
              <option value="Anytime">Anytime</option>
            </select>
          </div>
        </div>

        {/* Weekdays Selector (Only shown if schedule_type === 'weekly') */}
        {selectedSchedule === 'weekly' && (
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 animate-fade-in">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Select Active Days *
            </label>
            <div className="flex items-center justify-between gap-1">
              {WEEKDAYS.map((day) => {
                const isSelected = selectedWeekdays.includes(day.id);
                return (
                  <button
                    type="button"
                    key={day.id}
                    onClick={() => toggleWeekday(day.id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30 scale-105'
                        : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            {errors.weekdays && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.weekdays.message}</p>}
          </div>
        )}

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date *"
            error={errors.date?.message}
            {...register('date')}
          />
          <Input
            type="time"
            label="Trigger Time *"
            error={errors.time?.message}
            {...register('time')}
          />
        </div>

        {/* Repeat Cycle & Snooze Settings */}
        <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <Repeat className="w-4 h-4 text-primary" />
            <span>AI Follow-up Cycle & Repeat Alert Rules</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Max Repeat Reminders
              </label>
              <select
                {...register('remind_count', { valueAsNumber: true })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs font-semibold outline-none text-slate-800 dark:text-white focus:ring-1 focus:ring-primary"
              >
                <option value={1}>1 time (No Repeat)</option>
                <option value={2}>2 times (If unanswered)</option>
                <option value={3}>3 times (Recommended)</option>
                <option value={5}>5 times (High Priority)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Repeat Interval
              </label>
              <select
                {...register('remind_interval_minutes', { valueAsNumber: true })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs font-semibold outline-none text-slate-800 dark:text-white focus:ring-1 focus:ring-primary"
              >
                <option value={5}>Every 5 Minutes</option>
                <option value={10}>Every 10 Minutes</option>
                <option value={15}>Every 15 Minutes</option>
                <option value={30}>Every 30 Minutes</option>
                <option value={60}>Every 1 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl shadow-md font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEditMode ? 'Update Reminder' : 'Save Schedule'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
