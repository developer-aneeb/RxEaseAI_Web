import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Spinner from '../../components/ui/Spinner';
import {
  Inbox, AlertTriangle, ShieldAlert, Sparkles, CalendarDays, CheckCircle2,
  Trash2, Archive, Search, MoreVertical, X, Clock, Settings, ShieldCheck, Moon, Shield
} from 'lucide-react';
import { reminderService } from '../../services/reminderService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

export default function NotificationsPage() {
  const showToast = useAppStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Unread' | 'High Priority' | 'Reminders' | 'Alerts'
  const [sortBy, setSortBy] = useState('Latest'); // 'Latest' | 'Priority' | 'Category'
  const [searchQuery, setSearchQuery] = useState('');

  // Toggles for Quick Settings
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  // Dropdown states for each item (by ID)
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await reminderService.getNotifications(100);
      let list = [];
      if (Array.isArray(response)) {
        list = response;
      } else if (response && Array.isArray(response.data)) {
        list = response.data;
      } else if (response && Array.isArray(response.notifications)) {
        list = response.notifications;
      } else if (response && response.data && Array.isArray(response.data.notifications)) {
        list = response.data.notifications;
      }
      setNotifications(list);
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to fetch notifications.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await reminderService.markNotificationRead(id);
      showToast('Notification marked as read.', 'info');
      fetchNotifications();
      setActiveDropdown(null);
    } catch (error) {
      console.error(error);
      showToast('Failed to update notification.', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await reminderService.markAllNotificationsRead();
      showToast('All notifications marked as read.', 'success');
      fetchNotifications();
    } catch (error) {
      console.error(error);
      showToast('Failed to update notifications.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await reminderService.deleteNotification(id);
      showToast('Notification deleted.', 'info');
      fetchNotifications();
      setActiveDropdown(null);
    } catch (error) {
      console.error(error);
      showToast('Failed to delete notification.', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all notifications?')) return;
    try {
      await reminderService.clearAllNotifications();
      showToast('Notification queue cleared.', 'success');
      fetchNotifications();
    } catch (error) {
      console.error(error);
      showToast('Failed to clear notifications.', 'error');
    }
  };

  // Normalize API data to UI format
  const normalizedNotifications = notifications.map(item => {
    const dateObj = item.created_at ? new Date(item.created_at) : new Date();
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isToday = dateObj.toDateString() === new Date().toDateString();
    const isUnread = item.status === 'pending' || item.status === 'triggered';
    const isHighPriority = item.event_type === 'dose_missed' || item.event_type === 'dose_skipped';
    const generatedTitle = item.event_type 
      ? item.event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
      : 'Notification Alert';

    return {
      id: item.id,
      category: item.notification_type || 'System',
      priority: isHighPriority ? 'high' : 'normal',
      title: item.title || generatedTitle,
      description: item.message || '',
      time: timeStr,
      isToday,
      unread: isUnread,
      rawDate: dateObj
    };
  });

  // Filtering Logic
  const filteredNotifications = normalizedNotifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return n.unread;
    if (activeFilter === 'High Priority') return n.priority === 'high';
    if (activeFilter === 'Reminders') return n.category === 'Reminders' || n.category === 'Prescription';
    if (activeFilter === 'Alerts') return n.category === 'Security' || n.category === 'System';
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Priority') {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
    }
    if (sortBy === 'Category') {
      return a.category.localeCompare(b.category);
    }
    // Default is Latest
    return b.rawDate - a.rawDate;
  });

  const todayItems = filteredNotifications.filter(n => n.isToday);
  const olderItems = filteredNotifications.filter(n => !n.isToday);

  const totalCount = normalizedNotifications.length;
  const unreadCount = normalizedNotifications.filter(n => n.unread).length;
  const highPriorityCount = normalizedNotifications.filter(n => n.priority === 'high' && n.unread).length;

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

          {/* Main workspace */}
          <div className="flex-1 w-full space-y-8 text-left animate-fade-up">

            {/* Header section with Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-xs font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-md"></span>
                  <span>Unified Health Intelligence</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  Notification <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Center</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  Track scheduled doses, prescription updates, security alerts, and system improvements.
                </p>
              </div>

              {/* Dynamic search bar */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs outline-none focus:ring-2 focus:ring-primary/50 text-slate-850 dark:text-white transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="glass" className="p-5 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Total</span>
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary"><Inbox className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">{totalCount}</div>
              </Card>

              <Card variant="glass" className="p-5 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Unread</span>
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-500"><AlertTriangle className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-slate-850 dark:text-white mt-1">{unreadCount}</div>
              </Card>

              <Card variant="glass" className={`p-5 flex flex-col gap-2 shadow-sm transition-all relative overflow-hidden ${highPriorityCount > 0 ? 'ring-1 ring-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.05)]' : ''}`}>
                {highPriorityCount > 0 && (
                  <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none"></div>
                )}
                <div className="flex justify-between items-center text-slate-400 relative z-10">
                  <span className="text-xs font-bold uppercase">High Priority</span>
                  <div className="p-1.5 bg-rose-100 dark:bg-rose-950 text-rose-500 rounded-lg"><ShieldAlert className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-rose-600 dark:text-rose-500 mt-1 relative z-10">{highPriorityCount}</div>
              </Card>

              <Card variant="glass" className="p-5 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Today</span>
                  <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-lg"><CalendarDays className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                  {normalizedNotifications.filter(n => n.isToday).length}
                </div>
              </Card>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 w-full sm:w-auto">
                {['All', 'Unread', 'High Priority', 'Reminders', 'Alerts'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${activeFilter === filter
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Actions & Sort */}
              <div className="flex gap-3 items-center w-full sm:w-auto justify-end">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-bold text-primary hover:underline border-0 bg-transparent cursor-pointer"
                >
                  Mark all as read
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-rose-500 hover:underline border-0 bg-transparent cursor-pointer"
                >
                  Clear all
                </button>
                <span className="text-slate-300">|</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-primary font-medium"
                >
                  <option>Latest</option>
                  <option>Priority</option>
                  <option>Category</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
                {/* Feed Block (8 Cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Today Items */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <span>Today</span>
                      <span className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></span>
                    </h3>

                    {todayItems.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No matching notifications for today.</p>
                    ) : (
                      todayItems.map(item => (
                        <div
                          key={item.id}
                          className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all relative overflow-hidden group text-left ${item.priority === 'high'
                              ? 'border-rose-250 dark:border-rose-900/50 shadow-[0_4px_20px_rgba(244,63,94,0.05)]'
                              : 'border-slate-200 dark:border-slate-800 hover:shadow-md'
                            }`}
                        >
                          {item.priority === 'high' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                          )}
                          <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.priority === 'high'
                                ? 'bg-rose-105 dark:bg-rose-950 text-rose-500'
                                : 'bg-primary/10 text-primary'
                              }`}>
                              <MaterialIcon name="alarm" size="sm" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1 gap-2">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.priority === 'high'
                                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}>
                                    {item.category}
                                  </span>
                                  <span className="text-[10px] text-slate-405 font-medium">{item.time}</span>
                                </div>

                                <div className="relative">
                                  <button
                                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  {activeDropdown === item.id && (
                                    <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-1 z-20 text-xs">
                                      {item.unread && (
                                        <button onClick={() => handleMarkAsRead(item.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 font-medium flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Mark Read
                                        </button>
                                      )}
                                      <button onClick={() => handleDelete(item.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-rose-500 font-medium flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                {item.title}
                                {item.unread && <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Older Items */}
                  <div className="space-y-3 mt-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <span>Older Notifications</span>
                      <span className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></span>
                    </h3>

                    {olderItems.length === 0 ? (
                      <p className="text-xs text-slate-455 text-center py-6">No older notifications.</p>
                    ) : (
                      olderItems.map(item => (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden text-left"
                        >
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-105 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                              <MaterialIcon name="alarm" size="sm" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1 gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-500">
                                    {item.category}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                                </div>

                                <div className="relative">
                                  <button
                                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  {activeDropdown === item.id && (
                                    <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-1 z-20 text-xs">
                                      <button onClick={() => handleDelete(item.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-rose-500 font-medium flex items-center gap-2 border-0 bg-transparent cursor-pointer">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <h4 className="text-sm font-bold text-slate-850 dark:text-white">{item.title}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sidebar Panel (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Quick Settings */}
                  <Card variant="glass" className="p-6 text-left">
                    <h3 className="text-sm font-black text-slate-850 dark:text-white mb-5 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-slate-400" /> Quick Settings
                    </h3>
                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-white">Push Notifications</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Desktop & Mobile</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setPushEnabled(!pushEnabled); showToast(`Push notifications ${!pushEnabled ? 'enabled' : 'disabled'}`, 'info'); }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative shrink-0 border-0 ${pushEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${pushEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-white">Email Digests</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Daily summaries</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setEmailEnabled(!emailEnabled); showToast(`Email digests ${!emailEnabled ? 'enabled' : 'disabled'}`, 'info'); }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative shrink-0 border-0 ${emailEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${emailEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
