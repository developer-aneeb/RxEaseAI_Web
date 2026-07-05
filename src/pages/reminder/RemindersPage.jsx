import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reminderSchema } from '../../utils/validation/zodSchemas';
import {
  BellRing, CheckCircle2, Clock, AlertTriangle, Sparkles,
  MoreVertical, Utensils, Timer, Smartphone, Calendar, ChevronRight, X, Loader2, Trash2
} from 'lucide-react';
import { reminderService } from '../../services/reminderService';
import { followUpService } from '../../services/followUpService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

export default function RemindersPage() {
  const showToast = useAppStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);

  // States
  const [reminders, setReminders] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  // Refill loading state
  const [isRefilling, setIsRefilling] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      name: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      meal: 'Breakfast'
    }
  });

  const fetchReminderData = async () => {
    setIsLoading(true);
    try {
      const response = await reminderService.list();
      const list = response?.reminders || [];
      setReminders(list);

      // Also fetch follow-ups
      const fResponse = await followUpService.list();
      setFollowups(fResponse?.follow_ups || []);
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to fetch reminders.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminderData();
  }, []);

  const handleTakeAction = async (id, action) => {
    try {
      await reminderService.takeAction(id, action);
      showToast(`Medication ${action === 'take' ? 'taken' : 'skipped'} successfully!`, 'success');
      fetchReminderData();
    } catch (error) {
      console.error(error);
      showToast('Failed to log reminder action.', 'error');
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await reminderService.remove(id);
      showToast('Reminder deleted successfully.', 'success');
      fetchReminderData();
    } catch (error) {
      console.error(error);
      showToast('Failed to delete reminder.', 'error');
    }
  };

  const onSubmitReminder = async (data) => {
    try {
      // Map local form fields to backend properties
      const startAtISO = new Date(`${data.date}T${data.time || '12:00'}:00`).toISOString();
      
      const payload = {
        medicine_name: data.name,
        schedule_type: 'daily',
        start_at: startAtISO,
        remind_count: 1
      };

      await reminderService.create(payload);
      showToast('New reminder scheduled successfully!', 'success');
      setIsModalOpen(false);
      reset();
      fetchReminderData();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to save reminder.');
      showToast(friendlyMsg, 'error');
    }
  };

  const handleRefill = async (followupId) => {
    setIsRefilling(true);
    try {
      // Simulate ordering refill
      setTimeout(() => {
        showToast('Lipitor refill order placed successfully!', 'success');
        setIsRefilling(false);
      }, 1500);
    } catch (err) {
      setIsRefilling(false);
    }
  };

  // Format date helper
  const formatTime = (isoString) => {
    if (!isoString) return '12:00 PM';
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '12:00 PM';
    }
  };

  // Adherence Calculations
  const adherencePercent = (() => {
    if (reminders.length === 0) return 100;
    const taken = reminders.filter(r => r.status === 'taken' || r.status === 'completed').length;
    return Math.round((taken / reminders.length) * 100);
  })();

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'New Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Recommendations', href: '#recommendations' },
    { name: 'Search', href: '#search' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Reminders', href: '#reminders' },
    { name: 'Notifications', href: '#notifications' },
    { name: 'Dashboard', href: '#history-dashboard' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Main Workspace */}
          <div className="flex-1 w-full space-y-8 animate-fade-up">

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-xs font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,107,251,0.8)] animate-pulse"></span>
                  <span>Clinical Command</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-850 dark:text-white">
                  Medication <span className="text-primary">Reminder Center</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-550 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  Manage schedules, track adherence, and receive AI-driven timeline optimizations.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl shadow-md font-bold flex items-center gap-2 cursor-pointer"
              >
                <BellRing className="w-4 h-4" />
                <span>Add Reminder</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card variant="glass" className="p-5 flex flex-col gap-2 relative overflow-hidden group text-left">
                    <div className="absolute -right-4 -top-4 text-slate-100 dark:text-slate-800 opacity-50 group-hover:scale-110 transition-transform">
                      <MaterialIcon name="medication" style={{ fontSize: '100px' }} />
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-xs font-bold text-slate-500 uppercase">Today's Reminders</span>
                      <MaterialIcon name="medication" className="text-primary" size="sm" />
                    </div>
                    <div className="text-4xl font-black text-slate-800 dark:text-white mt-2 relative z-10">{reminders.length}</div>
                  </Card>

                  <Card variant="glass" className="p-5 flex flex-col gap-2 relative overflow-hidden group text-left">
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-xs font-bold text-slate-500 uppercase">Taken</span>
                      <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    </div>
                    <div className="text-4xl font-black text-slate-800 dark:text-white mt-2 relative z-10">
                      {reminders.filter(r => r.status === 'taken' || r.status === 'completed').length}
                    </div>
                  </Card>

                  <Card variant="glass" className="p-5 flex flex-col gap-2 relative overflow-hidden group text-left">
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-xs font-bold text-slate-500 uppercase">Pending</span>
                      <Clock className="text-tertiary w-5 h-5" />
                    </div>
                    <div className="text-4xl font-black text-slate-800 dark:text-white mt-2 relative z-10">
                      {reminders.filter(r => r.status === 'pending' || r.status === 'scheduled').length}
                    </div>
                  </Card>

                  <Card variant="glass" className="p-5 flex flex-col items-center justify-center gap-2 relative">
                    <span className="text-xs font-bold text-slate-500 uppercase absolute top-4 left-5">Adherence</span>
                    <div className="relative w-20 h-20 mt-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                        <path className="text-emerald-500 transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${adherencePercent}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-slate-800 dark:text-white">{adherencePercent}%</div>
                    </div>
                  </Card>
                </div>

                {/* Layout Grid for Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">

                  {/* Left Column (Main Schedule) */}
                  <div className="flex-1 lg:w-2/3 flex flex-col gap-6">
                    {/* Today's Schedule */}
                    <Card variant="glass" className="p-6 flex-1 shadow-sm text-left">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Schedule</h3>
                      </div>

                      <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                        {reminders.map((item) => (
                          <div key={item.id} className="relative flex items-start gap-6 group">
                            
                            {/* Timeline node */}
                            <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-primary flex items-center justify-center z-10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>

                            {/* Card */}
                            <div className="flex-1 p-4 rounded-xl shadow-sm border bg-white dark:bg-slate-900/50 border-slate-205 dark:border-slate-800 flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-800 dark:text-white text-sm">{item.medicine_name}</span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                                    item.status === 'taken' || item.status === 'completed'
                                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                                  }`}>
                                    {item.status || 'Active'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                  <Clock className="w-3.5 h-3.5" /> Start Time: {formatTime(item.start_at)}
                                </p>
                              </div>

                              <div className="flex gap-2 items-center relative">
                                <button
                                  onClick={() => handleTakeAction(item.id, 'take')}
                                  className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-lg transition-colors border-0 cursor-pointer"
                                  title="Mark Taken"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                                  className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {activeMenuId === item.id && (
                                  <div className="absolute right-0 top-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-20 min-w-[120px]">
                                    <button
                                      onClick={() => {
                                        handleTakeAction(item.id, 'skip');
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg border-0 bg-transparent cursor-pointer"
                                    >
                                      Skip Dose
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeleteReminder(item.id);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg border-0 bg-transparent cursor-pointer"
                                    >
                                      Delete Reminder
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {reminders.length === 0 && (
                          <div className="py-16 text-center text-slate-450">
                            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No active medication schedules</h4>
                            <p className="text-xs text-slate-400 mt-1">Upload a prescription or click Add Reminder to begin.</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Right Column (Widgets) */}
                  <div className="flex-1 lg:w-1/3 flex flex-col gap-6">
                    {/* Calendar Adherence Grid */}
                    <Card variant="glass" className="p-6 text-left">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" /> Adherence Grid
                        </h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Current Week</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                          <div key={i} className="text-[10px] font-bold text-slate-400 mb-1">{day}</div>
                        ))}
                        {/* Days */}
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`aspect-square flex items-center justify-center rounded-full text-xs font-bold ${
                              i === 4
                                ? 'bg-primary text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                            }`}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Follow-up Reminders */}
                    <Card variant="glass" className="p-6 text-left">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Follow-up Tasks</h3>
                      <ul className="space-y-4">
                        {followups.map((f) => (
                          <li key={f.id} className="flex items-center gap-4">
                            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-550 shrink-0">
                              <MaterialIcon name="autorenew" size="sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{f.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 truncate">{new Date(f.scheduled_at).toLocaleDateString()}</p>
                            </div>
                            <button
                              onClick={() => handleRefill(f.id)}
                              disabled={isRefilling}
                              className="text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-lg disabled:opacity-50 cursor-pointer border-0"
                            >
                              {isRefilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Refill'}
                            </button>
                          </li>
                        ))}

                        {followups.length === 0 && (
                          <div className="py-6 text-center text-xs text-slate-450 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            No active follow-up events scheduled.
                          </div>
                        )}
                      </ul>
                    </Card>
                  </div>

                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); reset(); }}
        title={
          <span className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-primary" /> Schedule New Reminder
          </span>
        }
      >
        <form onSubmit={handleSubmit(onSubmitReminder)} className="space-y-4">
          <Input
            label="Medicine Name"
            placeholder="e.g. Lisinopril 10mg"
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              type="date"
              label="Date"
              min={new Date().toISOString().split('T')[0]}
              error={errors.date?.message}
              {...register('date')}
            />
            <Input
              type="time"
              label="Time"
              error={errors.time?.message}
              {...register('time')}
            />
            <div className="text-left font-sans">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Meal Timing</label>
              <select
                {...register('meal')}
                className={`w-full bg-slate-50 dark:bg-slate-955 border rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800 dark:text-white ${
                  errors.meal 
                    ? 'border-rose-500 ring-2 ring-rose-500/20' 
                    : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary'
                }`}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Before Sleep">Before Sleep</option>
                <option value="Anytime">Anytime</option>
              </select>
              {errors.meal && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.meal.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-container text-white font-bold py-2.5 rounded-xl mt-4 cursor-pointer">
            Save Schedule
          </Button>
        </form>
      </Modal>
    </div>
  );
}
