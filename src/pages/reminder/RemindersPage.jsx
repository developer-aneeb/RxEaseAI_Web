import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import SideNavbar from '../../components/layout/SideNavbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reminderSchema } from '../../utils/validation/zodSchemas';
import {
  BellRing, CheckCircle2, Clock, AlertTriangle, Sparkles,
  MoreVertical, Utensils, Timer, Smartphone, Calendar, ChevronRight, X, Loader2
} from 'lucide-react';

export default function RemindersPage() {
  const showToast = useAppStore((state) => state.showToast);

  // States for interactive elements
  const [missedAlert, setMissedAlert] = useState(true);
  const [insightAlert, setInsightAlert] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Timer State
  const [timeLeft, setTimeLeft] = useState({ h: 1, m: 12, s: 25 });

  // Dynamic Stats
  const [stats, setStats] = useState({
    total: 8,
    completed: 6,
    adherence: 95
  });

  // Dynamic Schedule List
  const [schedule, setSchedule] = useState([
    { id: 1, name: 'Paracetamol 500mg', status: 'completed', meal: 'Breakfast', time: '08:00 AM', due: null },
    { id: 2, name: 'Amoxicillin', status: 'upcoming', meal: 'Lunch', time: '01:00 PM', due: '01:12:25' },
    { id: 3, name: 'Montelukast', status: 'pending', meal: 'Dinner', time: '08:00 PM', due: null },
  ]);

  // Loading states for actions
  const [isRefilling, setIsRefilling] = useState(false);

  // Hook Form for New Reminder
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

  // Real-time Countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) {
          s -= 1;
        } else {
          if (m > 0) {
            m -= 1;
            s = 59;
          } else {
            if (h > 0) {
              h -= 1;
              m = 59;
              s = 59;
            } else {
              clearInterval(timer);
            }
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t) => t.toString().padStart(2, '0');

  const handleTakeMissedDose = () => {
    showToast('Missed dose of Amoxicillin logged successfully!', 'success');
    setMissedAlert(false);
    setStats(prev => ({ ...prev, completed: prev.completed + 1 }));
  };

  const handleAcceptInsight = () => {
    showToast('Suggestion accepted. Amoxicillin reminder moved to 7:45 PM.', 'success');
    setInsightAlert(false);
    // Update schedule
    setSchedule(prev => prev.map(item =>
      item.name === 'Amoxicillin' ? { ...item, time: '07:45 PM' } : item
    ));
  };

  const onSubmitReminder = (data) => {
    const newItem = {
      id: Date.now(),
      name: data.name,
      status: 'pending',
      meal: data.meal,
      date: data.date,
      time: data.time,
      due: null
    };

    setSchedule(prev => [...prev, newItem]);
    setStats(prev => ({ ...prev, total: prev.total + 1, adherence: Math.round(((prev.completed) / (prev.total + 1)) * 100) }));
    setIsModalOpen(false);
    showToast('New reminder scheduled successfully!', 'success');
    reset();
  };

  const handleRefill = () => {
    setIsRefilling(true);
    setTimeout(() => {
      setIsRefilling(false);
      showToast('Lipitor refill order placed successfully!', 'success');
    }, 1500);
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'New Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Recommendations', href: '#recommendations' },
    { name: 'Search', href: '#search' },
    { name: 'Analytics', href: '#analytics' },
    // { name: 'Reminders', href: '#reminders' },
    // { name: 'Notifications', href: '#notifications' },
  ];

  const user = useAuthStore((state) => state.user);

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* SideNavBar - Desktop only (matches Stitch Layout style) */}
          {/* <SideNavbar activeRoute="#reminders" /> */}

          {/* Main Workspace */}
          <div className="flex-1 w-full space-y-8">

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
                className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl shadow-md font-bold flex items-center gap-2"
              >
                <BellRing className="w-4 h-4" />
                <span>Add Reminder</span>
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <Card variant="glass" className="p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-slate-100 dark:text-slate-800 opacity-50 group-hover:scale-110 transition-transform">
                  <MaterialIcon name="medication" style={{ fontSize: '100px' }} />
                </div>
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-xs font-bold text-slate-500 uppercase">Today's Medicines</span>
                  <MaterialIcon name="medication" className="text-primary" size="sm" />
                </div>
                <div className="text-4xl font-black text-slate-800 dark:text-white mt-2 relative z-10">{stats.total}</div>
              </Card>

              {/* Stat 2 */}
              <Card variant="glass" className="p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-xs font-bold text-slate-500 uppercase">Completed</span>
                  <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                </div>
                <div className="text-4xl font-black text-slate-800 dark:text-white mt-2 relative z-10">{stats.completed}</div>
              </Card>

              {/* Stat 3 */}
              <Card variant="glass" className="p-5 flex flex-col gap-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-primary/20 shadow-[inset_0_0_20px_rgba(0,107,251,0.05)] relative">
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-xs font-bold text-slate-500 uppercase">Next Reminder</span>
                  <Clock className="text-tertiary w-5 h-5 animate-pulse" />
                </div>
                <div className="text-3xl font-black text-primary mt-auto relative z-10 tracking-wider font-mono">
                  {formatTime(timeLeft.h)}:{formatTime(timeLeft.m)}:{formatTime(timeLeft.s)}
                </div>
              </Card>

              {/* Stat 4 */}
              <Card variant="glass" className="p-5 flex flex-col items-center justify-center gap-2 relative">
                <span className="text-xs font-bold text-slate-500 uppercase absolute top-4 left-5">Adherence</span>
                <div className="relative w-20 h-20 mt-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                    <path className="text-emerald-500 transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats.adherence}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-slate-800 dark:text-white">{stats.adherence}%</div>
                </div>
              </Card>
            </div>

            {/* Layout Grid for Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">

              {/* Left Column (Main Schedule) */}
              <div className="flex-1 lg:w-2/3 flex flex-col gap-6">

                <AnimatePresence>
                  {missedAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                      <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-full text-rose-600 shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-rose-800 dark:text-rose-200">Missed Dose Alert</h3>
                        <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">Amoxicillin was missed 2 hours ago. Risk: <span className="font-bold">Medium</span>.</p>
                      </div>
                      <Button onClick={handleTakeMissedDose} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-lg">
                        Take Now
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {insightAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-indigo-50/50 dark:bg-indigo-950/20 border-t-2 border-t-tertiary border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-start gap-4 shadow-sm"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-tertiary shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white">AI Smart Insight</h3>
                          <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[9px] px-2 py-0.5 rounded-full uppercase font-black tracking-wide">Beta</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                          You frequently miss evening doses on Tuesdays. We suggest moving your reminder to 7:45 PM to better align with your routine.
                        </p>
                        <div className="mt-4 flex gap-4">
                          <button onClick={handleAcceptInsight} className="text-xs font-bold text-tertiary hover:underline">Accept Suggestion</button>
                          <button onClick={() => setInsightAlert(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">Dismiss</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Today's Schedule */}
                <Card variant="glass" className="p-6 flex-1 shadow-sm">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Today's Schedule</h3>
                    <button className="text-slate-400 hover:text-primary transition-colors p-2"><MoreVertical className="w-5 h-5" /></button>
                  </div>

                  <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">

                    {schedule.map((item, idx) => (
                      <div key={item.id} className="relative flex items-start gap-6 group">

                        {/* Timeline node */}
                        {item.status === 'completed' && (
                          <div className="absolute left-[-26px] mt-1 bg-white dark:bg-slate-900 rounded-full p-0.5 z-10 border border-emerald-500">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </div>
                        )}
                        {item.status === 'upcoming' && (
                          <div className="absolute left-[-26px] mt-1 bg-white dark:bg-slate-900 rounded-full p-0.5 z-10 border border-primary shadow-[0_0_8px_rgba(0,107,251,0.5)]">
                            <Clock className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        {item.status === 'pending' && (
                          <div className="absolute left-[-22px] mt-2.5 bg-slate-300 dark:bg-slate-700 rounded-full w-2 h-2 z-10"></div>
                        )}

                        {/* Card */}
                        <div className={`flex-1 p-4 rounded-xl shadow-sm border transition-all ${item.status === 'upcoming'
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-90'
                          }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</span>
                                {item.status === 'completed' && <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Completed</span>}
                                {item.status === 'upcoming' && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase">Upcoming</span>}
                                {item.status === 'pending' && <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Pending</span>}
                              </div>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                <Utensils className="w-3.5 h-3.5" /> {item.meal}
                              </p>
                              {item.status === 'upcoming' && (
                                <div className="mt-3 flex items-center gap-1.5 text-primary text-xs font-bold bg-primary/5 w-fit px-2 py-1 rounded-md">
                                  <Timer className="w-3.5 h-3.5" />
                                  Due in {formatTime(timeLeft.h)}:{formatTime(timeLeft.m)}:{formatTime(timeLeft.s)}
                                </div>
                              )}
                            </div>
                            <span className={`text-xs font-bold ${item.status === 'upcoming' ? 'text-primary' : 'text-slate-500'}`}>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </Card>
              </div>

              {/* Right Column (Widgets) */}
              <div className="flex-1 lg:w-1/3 flex flex-col gap-6">

                {/* Push Previews */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    Notification Previews
                  </h3>
                  <div className="space-y-3">
                    {/* iOS Style */}
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-3 shadow-sm border border-slate-200 dark:border-slate-800 flex gap-3 items-center">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <MaterialIcon name="medication" size="sm" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">Time for Paracetamol</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Take 1 pill (500mg) with food.</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Now</span>
                    </div>

                    {/* Android Style */}
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-3 shadow-sm border border-rose-200 dark:border-rose-900/50 flex gap-3 items-center relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                      <div className="bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 p-2 rounded-full ml-1">
                        <BellRing className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">Dose Missed</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Amoxicillin schedule missed.</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">2h ago</span>
                    </div>
                  </div>
                </Card>

                {/* Calendar Adherence Grid */}
                <Card variant="glass" className="p-6">
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
                    <div className="aspect-square flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer relative"><div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></div>1</div>
                    <div className="aspect-square flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer relative"><div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></div>2</div>
                    <div className="aspect-square flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer relative"><div className="absolute bottom-1 w-1 h-1 bg-rose-500 rounded-full"></div>3</div>
                    <div className="aspect-square flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer relative"><div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></div>4</div>
                    <div className="aspect-square flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-md relative"><div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>5</div>
                    <div className="aspect-square flex items-center justify-center rounded-full text-slate-400 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">6</div>
                    <div className="aspect-square flex items-center justify-center rounded-full text-slate-400 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">7</div>
                  </div>
                </Card>

                {/* Follow-up Reminders */}
                <Card variant="glass" className="p-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Follow-up Tasks</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-4">
                      <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500">
                        <MaterialIcon name="autorenew" size="sm" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">Refill Lipitor</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">3 days remaining</p>
                      </div>
                      <button onClick={handleRefill} disabled={isRefilling} className="text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-lg disabled:opacity-50">
                        {isRefilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Order'}
                      </button>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-500">
                        <MaterialIcon name="biotech" size="sm" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">Blood Test</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Next Friday</p>
                      </div>
                      <ChevronRight className="text-slate-400 w-4 h-4" />
                    </li>
                  </ul>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      <AnimatePresence>
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
            <div className="text-left">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Meal Timing</label>
              <select
                {...register('meal')}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800 dark:text-white ${
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
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl mt-4">
            Save Schedule
          </Button>
        </form>
      </Modal>
      </AnimatePresence>
    </div>
  );
}
