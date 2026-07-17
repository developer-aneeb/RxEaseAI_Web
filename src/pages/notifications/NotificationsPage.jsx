import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import {
  Inbox, AlertTriangle, ShieldAlert, CalendarDays, Search, Settings
} from 'lucide-react';
import { reminderService } from '../../services/reminderService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

import NotificationFeed from './NotificationFeed';

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
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.notifications)) {
        list = response.data.data.notifications;
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

    // Status unread check: Handle missing status or non-delivered as unread!
    const isUnread = item.status !== 'delivered' && item.status !== 'read';

    // Priority check
    const isHighPriority = item.event_type === 'dose_missed' || item.event_type === 'dose_skipped';

    // Generated Title matching backend
    const generatedTitle = item.event_type
      ? item.event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : 'Notification Alert';

    // Map Event categories
    const isReminder = ['dose_due', 'dose_taken', 'dose_skipped', 'dose_missed'].includes(item.event_type);
    const category = isReminder ? 'Reminder' : (item.notification_type || 'System');

    // Set nice icons based on event type
    let iconName = 'alarm';
    let iconColor = 'text-primary bg-primary/10';
    if (item.event_type === 'dose_missed') {
      iconName = 'warning';
      iconColor = 'text-rose-500 bg-rose-500/10';
    } else if (item.event_type === 'dose_taken') {
      iconName = 'check_circle';
      iconColor = 'text-emerald-500 bg-emerald-500/10';
    } else if (item.event_type === 'dose_skipped') {
      iconName = 'visibility_off';
      iconColor = 'text-amber-500 bg-amber-500/10';
    }

    return {
      id: item.id,
      category,
      priority: isHighPriority ? 'high' : 'normal',
      title: item.title || generatedTitle,
      description: item.message || '',
      time: timeStr,
      isToday,
      unread: isUnread,
      rawDate: dateObj,
      iconName,
      iconColor
    };
  });

  // Base list that undergoes searching/sorting but NOT tab filtering (tab components do that!)
  // Wait: The activeFilter applies at the page level. So we pass the correctly filtered list to NotificationFeed!
  const searchedNotifications = normalizedNotifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'Priority') {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
    }
    if (sortBy === 'Category') {
      return a.category.localeCompare(b.category);
    }
    return b.rawDate - a.rawDate;
  });

  // Global filters
  let filteredListForTab = searchedNotifications;
  if (activeFilter === 'Reminders') {
    filteredListForTab = searchedNotifications.filter(n => n.category === 'Reminder' || n.category === 'Reminders' || n.category === 'Prescription');
  } else if (activeFilter === 'Alerts') {
    filteredListForTab = searchedNotifications.filter(n => n.category === 'System' || n.category === 'Security' || n.category === 'Alerts');
  }

  // Stats Counters
  const totalCount = normalizedNotifications.length;
  const unreadCount = normalizedNotifications.filter(n => n.unread).length;
  // Fixed bug: High priority counts are independent of their unread state!
  const highPriorityCount = normalizedNotifications.filter(n => n.priority === 'high').length;

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Search', href: '#search' },
    { name: 'Reminders', href: '#reminders' },
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
                <div className="text-3xl font-black text-slate-855 dark:text-white mt-1">{unreadCount}</div>
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
              <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
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
                  Mark all read
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

                  {/* Tab Rendering Logic */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFilter}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NotificationFeed
                        items={
                          activeFilter === 'Unread'
                            ? filteredListForTab.filter(n => n.unread)
                            : activeFilter === 'High Priority'
                              ? filteredListForTab.filter(n => n.priority === 'high')
                              : filteredListForTab
                        }
                        onMarkRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        emptyMessage={
                          activeFilter === 'Unread'
                            ? "No unread notifications right now. You're all caught up!"
                            : activeFilter === 'High Priority'
                              ? "No high priority alerts found. Good job!"
                              : `No notifications found in ${activeFilter}.`
                        }
                      />
                    </motion.div>
                  </AnimatePresence>

                </div>

                {/* Sidebar Panel (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Quick Settings */}
                  <Card variant="glass" className="p-6 text-left bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-black text-slate-850 dark:text-white mb-5 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-slate-400" /> Notification Channels
                    </h3>
                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-white">Push Alerts</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Desktop push triggers</div>
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
                          <div className="text-[10px] text-slate-500 mt-0.5">Clinical email notifications</div>
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
