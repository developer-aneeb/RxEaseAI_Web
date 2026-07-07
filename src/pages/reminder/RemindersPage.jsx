import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Spinner from '../../components/ui/Spinner';
import {
  BellRing, CheckCircle2, Clock, Calendar, Plus, Activity, Stethoscope, RefreshCw, Sparkles, ShieldAlert, ChevronLeft, ChevronRight
} from 'lucide-react';
import { reminderService } from '../../services/reminderService';
import { followUpService } from '../../services/followUpService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import ReminderModal from './ReminderModal';
import FollowUpModal from './FollowUpModal';
import ReminderCard from './ReminderCard';
import FollowUpCard from './FollowUpCard';

export default function RemindersPage() {
  const showToast = useAppStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);

  // Data States
  const [reminders, setReminders] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Edit States
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Refill simulation state
  const [isRefilling, setIsRefilling] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const [followUpCurrentPage, setFollowUpCurrentPage] = useState(1);
  const [followUpItemsPerPage, setFollowUpItemsPerPage] = useState(5);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [remindersRes, followupsRes] = await Promise.all([
        reminderService.list().catch((err) => {
          console.error('Error fetching reminders:', err);
          return { reminders: [] };
        }),
        followUpService.list().catch((err) => {
          console.error('Error fetching follow-ups:', err);
          return { follow_ups: [] };
        })
      ]);

      setReminders(remindersRes?.reminders || []);
      setFollowups(followupsRes?.follow_ups || []);
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to fetch reminder schedules.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Medicine Reminder Handlers ──

  const handleSaveReminder = async (payload, editId) => {
    setIsSaving(true);
    try {
      if (editId) {
        await reminderService.update(editId, payload);
        showToast('Medication reminder updated successfully!', 'success');
      } else {
        await reminderService.create(payload);
        showToast('New medication reminder scheduled!', 'success');
      }
      setIsReminderModalOpen(false);
      setEditingReminder(null);
      fetchData();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to save reminder.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTakeAction = async (id, action) => {
    try {
      await reminderService.takeAction(id, action);
      showToast(`Medication dose marked as ${action === 'take' ? 'taken' : 'skipped'}!`, 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Failed to record dose action.', 'error');
    }
  };

  const handleSnooze = async (id, minutes) => {
    try {
      await reminderService.snooze(id, minutes);
      showToast(`Reminder snoozed for ${minutes} minutes.`, 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Failed to snooze reminder.', 'error');
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication schedule?')) return;
    try {
      await reminderService.remove(id);
      showToast('Medication reminder deleted.', 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Failed to delete reminder.', 'error');
    }
  };

  // ── Follow-Up Task Handlers ──

  const handleSaveFollowUp = async (payload, editId) => {
    setIsSaving(true);
    try {
      if (editId) {
        await followUpService.update(editId, payload);
        showToast('Follow-up task updated successfully!', 'success');
      } else {
        await followUpService.create(payload);
        showToast('New clinical follow-up task scheduled!', 'success');
      }
      setIsFollowUpModalOpen(false);
      setEditingFollowUp(null);
      fetchData();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to save follow-up event.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFollowUp = async (id) => {
    if (!window.confirm('Delete this follow-up event?')) return;
    try {
      await followUpService.remove(id);
      showToast('Follow-up event deleted.', 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Failed to delete follow-up task.', 'error');
    }
  };

  const handleRefillSimulation = async (followupId) => {
    setIsRefilling(true);
    try {
      setTimeout(() => {
        showToast('Prescription refill order placed successfully!', 'success');
        setIsRefilling(false);
      }, 1500);
    } catch (err) {
      setIsRefilling(false);
    }
  };

  // Time Formatting Helper
  const formatTime = (isoString) => {
    if (!isoString) return '12:00 PM';
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '12:00 PM';
    }
  };

  // Adherence Calculation
  const adherencePercent = (() => {
    if (reminders.length === 0) return 100;
    const taken = reminders.filter(r => r.last_action === 'take' || r.status === 'taken' || r.status === 'completed').length;
    return Math.round((taken / reminders.length) * 100);
  })();

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Search', href: '#search' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Notifications', href: '#notifications' },
  ];

  // Pagination bounds calculation
  const totalFilteredCount = reminders.length;
  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage) || 1;
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [reminders, totalPages, currentPage]);

  const paginatedReminders = reminders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Follow-up Pagination bounds calculation
  const totalFollowUpCount = followups.length;
  const totalFollowUpPages = Math.ceil(totalFollowUpCount / followUpItemsPerPage) || 1;
  
  useEffect(() => {
    if (followUpCurrentPage > totalFollowUpPages && totalFollowUpPages > 0) {
      setFollowUpCurrentPage(totalFollowUpPages);
    }
  }, [followups, totalFollowUpPages, followUpCurrentPage]);

  const paginatedFollowUps = followups.slice(
    (followUpCurrentPage - 1) * followUpItemsPerPage,
    followUpCurrentPage * followUpItemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={navLinks} />

      {/* Ambient Glow Backgrounds */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">
        <div className="flex flex-col gap-8 items-start">
          
          <div className="flex-1 w-full space-y-8 animate-fade-up">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-xs font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,107,251,0.8)] animate-pulse"></span>
                  <span>Clinical Schedule Center</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-850 dark:text-white">
                  Medication <span className="text-primary">Reminder Center</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-550 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  Manage medication frequencies, customize repeat alert cycles, track adherence, and coordinate clinical follow-up events.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingFollowUp(null);
                    setIsFollowUpModalOpen(true);
                  }}
                  className="flex-1 md:flex-initial bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-5 py-3 rounded-xl shadow-sm font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-500" />
                  <span>Add Follow-up</span>
                </Button>

                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingReminder(null);
                    setIsReminderModalOpen(true);
                  }}
                  className="flex-1 md:flex-initial bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl shadow-md font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Add Reminder</span>
                </Button>
              </div>
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
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Schedules</span>
                      <MaterialIcon name="medication" className="text-primary" size="sm" />
                    </div>
                    <div className="text-4xl font-black text-slate-800 dark:text-white mt-2 relative z-10">{reminders.length}</div>
                  </Card>

                  <Card variant="glass" className="p-5 flex flex-col gap-2 relative overflow-hidden group text-left">
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Taken Today</span>
                      <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    </div>
                    <div className="text-4xl font-black text-slate-800 dark:text-white mt-2 relative z-10">
                      {reminders.filter(r => r.last_action === 'take' || r.status === 'taken' || r.status === 'completed').length}
                    </div>
                  </Card>

                  <Card variant="glass" className="p-5 flex flex-col gap-2 relative overflow-hidden group text-left">
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending / Due</span>
                      <Clock className="text-amber-500 w-5 h-5" />
                    </div>
                    <div className="text-4xl font-black text-slate-800 dark:text-white mt-2 relative z-10">
                      {reminders.filter(r => r.is_active !== false && r.last_action !== 'take' && r.last_action !== 'skip').length}
                    </div>
                  </Card>

                  <Card variant="glass" className="p-5 flex flex-col items-center justify-center gap-2 relative">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider absolute top-4 left-5">Adherence Rate</span>
                    <div className="relative w-20 h-20 mt-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-200 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                        <path className="text-emerald-500 transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${adherencePercent}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-slate-800 dark:text-white">{adherencePercent}%</div>
                    </div>
                  </Card>
                </div>

                {/* Main 2-Column Workspace Grid */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  
                  {/* Left Column (Medicine Schedule) 65% */}
                  <div className="w-full lg:w-[63%] space-y-6">
                    <Card variant="glass" className="p-6 text-left shadow-sm">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" /> Active Medication Schedules
                          </h3>
                          <p className="text-xs text-slate-450 mt-0.5">Automated repeat notifications & dosage adherence trackers.</p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={fetchData}
                          className="text-xs text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Refresh</span>
                        </Button>
                      </div>

                      <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                        {paginatedReminders.map((item) => (
                          <ReminderCard
                            key={item.id}
                            item={item}
                            onTakeAction={handleTakeAction}
                            onSnooze={handleSnooze}
                            onEdit={(rem) => {
                              setEditingReminder(rem);
                              setIsReminderModalOpen(true);
                            }}
                            onDelete={handleDeleteReminder}
                            formatTime={formatTime}
                          />
                        ))}

                        {reminders.length === 0 && (
                          <div className="py-16 text-center text-slate-450 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                            <BellRing className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No active medication schedules</h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                              Click "Add Reminder" above to configure daily, weekly, or monthly dosage alerts with repeat rules.
                            </p>
                            <Button
                              variant="primary"
                              onClick={() => {
                                setEditingReminder(null);
                                setIsReminderModalOpen(true);
                              }}
                              className="mt-4 bg-primary text-white text-xs px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" /> Add Reminder
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Pagination Controls */}
                      {totalFilteredCount > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
                          <div className="flex items-center gap-2">
                            <span>Show:</span>
                            <select
                              value={itemsPerPage}
                              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 font-bold outline-none text-slate-800 dark:text-white cursor-pointer"
                            >
                              <option value={5}>5 per page</option>
                              <option value={10}>10 per page</option>
                              <option value={20}>20 per page</option>
                              <option value={50}>50 per page</option>
                            </select>
                            <span>of {totalFilteredCount} matching</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all cursor-pointer bg-transparent ${currentPage === page
                                  ? 'border-primary text-primary shadow-sm ring-1 ring-primary/45 font-black'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Right Column (Widgets) 37% */}
                  <div className="w-full lg:w-[37%] space-y-6">
                    
                    {/* Calendar Adherence Grid */}
                    <Card variant="glass" className="p-6 text-left shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" /> Weekly Adherence Grid
                        </h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Current Week</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1.5 text-center">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                          <div key={i} className="text-[10px] font-bold text-slate-400 mb-1">{day}</div>
                        ))}
                        {[...Array(7)].map((_, i) => {
                          const isToday = i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6);
                          return (
                            <div
                              key={i}
                              className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                isToday
                                  ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105 ring-2 ring-primary/40'
                                  : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                              }`}
                            >
                              {i + 1}
                            </div>
                          );
                        })}
                      </div>
                    </Card>

                    {/* Follow-up Tasks Section */}
                    <Card variant="glass" className="p-6 text-left shadow-sm space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" /> Clinical Follow-ups
                          </h3>
                          <p className="text-[11px] text-slate-450 mt-0.5">Doctor revisits, lab tests & refills</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingFollowUp(null);
                            setIsFollowUpModalOpen(true);
                          }}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all border-0 bg-transparent cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>New</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {paginatedFollowUps.map((f) => (
                          <FollowUpCard
                            key={f.id}
                            item={f}
                            onEdit={(item) => {
                              setEditingFollowUp(item);
                              setIsFollowUpModalOpen(true);
                            }}
                            onDelete={handleDeleteFollowUp}
                            onRefill={handleRefillSimulation}
                            isRefilling={isRefilling}
                          />
                        ))}

                        {followups.length === 0 && (
                          <div className="py-8 text-center text-xs text-slate-450 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30">
                            <Stethoscope className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                            <p className="font-semibold text-slate-600 dark:text-slate-400">No follow-up events scheduled</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Schedule doctor checkups or lab diagnostic tests.</p>
                          </div>
                        )}
                      </div>

                      {/* Follow-Up Pagination Controls */}
                      {totalFollowUpCount > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 text-xs font-semibold text-slate-500">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setFollowUpCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={followUpCurrentPage === 1}
                              className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            {Array.from({ length: totalFollowUpPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setFollowUpCurrentPage(page)}
                                className={`w-7 h-7 rounded-lg border text-[10px] font-bold transition-all cursor-pointer bg-transparent ${followUpCurrentPage === page
                                  ? 'border-emerald-500 text-emerald-500 shadow-sm ring-1 ring-emerald-500/40 font-black'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setFollowUpCurrentPage(prev => Math.min(prev + 1, totalFollowUpPages))}
                              disabled={followUpCurrentPage === totalFollowUpPages}
                              className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Card>

                  </div>

                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Modals */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setEditingReminder(null);
        }}
        onSave={handleSaveReminder}
        initialData={editingReminder}
        isSaving={isSaving}
      />

      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setEditingFollowUp(null);
        }}
        onSave={handleSaveFollowUp}
        initialData={editingFollowUp}
        isSaving={isSaving}
      />
    </div>
  );
}
