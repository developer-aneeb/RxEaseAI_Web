import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { followUpSchema } from '../../utils/validation/zodSchemas';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Calendar, Clock, FileText, Stethoscope, Activity, RefreshCw, Loader2 } from 'lucide-react';

export default function FollowUpModal({ isOpen, onClose, onSave, initialData, isSaving }) {
  const isEditMode = Boolean(initialData?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      reminder_type: 'revisit',
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      notes: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        let dateStr = new Date().toISOString().split('T')[0];
        let timeStr = '10:00';
        if (initialData.scheduled_at) {
          try {
            const dt = new Date(initialData.scheduled_at);
            dateStr = dt.toISOString().split('T')[0];
            timeStr = dt.toTimeString().slice(0, 5);
          } catch (e) {
            console.error('Date parsing error:', e);
          }
        }
        reset({
          reminder_type: initialData.reminder_type || 'revisit',
          title: initialData.title || '',
          date: dateStr,
          time: timeStr,
          notes: initialData.notes || ''
        });
      } else {
        reset({
          reminder_type: 'revisit',
          title: '',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          notes: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (data) => {
    const scheduledAtISO = new Date(`${data.date}T${data.time || '10:00'}:00`).toISOString();
    const payload = {
      reminder_type: data.reminder_type,
      title: data.title.trim(),
      scheduled_at: scheduledAtISO,
      notes: data.notes ? data.notes.trim() : null
    };
    onSave(payload, initialData?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
          <Calendar className="w-5 h-5 text-emerald-500" />
          {isEditMode ? 'Edit Follow-up Event' : 'Schedule Clinical Follow-up'}
        </span>
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left font-sans">
        {/* Follow-up Type Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Follow-up Event Type *
          </label>
          <select
            {...register('reminder_type')}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium"
          >
            <option value="revisit">🩺 Doctor Revisit / Checkup</option>
            <option value="lab_test">🧪 Lab Test / Diagnostics</option>
            <option value="general">💊 Prescription Refill / General Task</option>
          </select>
          {errors.reminder_type && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.reminder_type.message}</p>}
        </div>

        {/* Title */}
        <Input
          label="Event Title *"
          placeholder="e.g. Lipid Profile Lab Test, Dr. Ali Checkup, Lipitor Refill"
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Scheduled Date *"
            error={errors.date?.message}
            {...register('date')}
          />
          <Input
            type="time"
            label="Scheduled Time *"
            error={errors.time?.message}
            {...register('time')}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Clinical Notes or Instructions (Optional)
          </label>
          <textarea
            {...register('notes')}
            rows="3"
            placeholder="Add any instructions, fasting rules, clinic address, or prescription notes..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans resize-none placeholder:text-slate-400"
          ></textarea>
        </div>

        {/* Action Buttons */}
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl shadow-md font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEditMode ? 'Update Event' : 'Schedule Event'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
