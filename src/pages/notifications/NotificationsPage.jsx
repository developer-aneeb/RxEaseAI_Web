import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import SideNavbar from '../../components/layout/SideNavbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';
import {
  Inbox, MailWarning, ShieldAlert, Sparkles, CalendarDays, CheckCircle2,
  Trash2, Archive, Search, MoreVertical, X, Clock, Settings, ShieldCheck, Moon, Shield
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    category: 'Reminders',
    priority: 'high',
    title: 'Time to take Amoxicillin 500mg',
    description: 'Scheduled dose for patient #8902 is due. Please confirm administration.',
    time: '10 mins ago',
    dateGroup: 'today',
    unread: true,
    action: 'take_now'
  },
  {
    id: 2,
    category: 'Prescription',
    priority: 'normal',
    title: 'Prescription processed successfully',
    description: 'Lisinopril 10mg refill authorized for pharmacy routing.',
    time: '2 hours ago',
    dateGroup: 'today',
    unread: true
  },
  {
    id: 3,
    category: 'System',
    priority: 'normal',
    title: 'AI OCR Engine v2.4 Live',
    description: 'Document parsing accuracy improved by 14% for handwritten notes.',
    time: '5 hours ago',
    dateGroup: 'today',
    unread: false
  },
  {
    id: 4,
    category: 'Security',
    priority: 'normal',
    title: 'New login detected from Mumbai, IN',
    description: 'A new device accessed your workspace. If this wasn\'t you, please secure your account.',
    time: 'Yesterday, 14:30',
    dateGroup: 'yesterday',
    unread: false,
    action: 'review_activity'
  },
  {
    id: 5,
    category: 'Admin',
    priority: 'normal',
    title: 'Feedback #402 reviewed',
    description: 'Your submitted UI feedback for the patient portal has been marked as resolved.',
    time: 'Yesterday, 09:15',
    dateGroup: 'yesterday',
    unread: false
  }
];

export default function NotificationsPage() {
  const showToast = useAppStore((state) => state.showToast);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Unread' | 'High Priority' | 'Reminders' | 'Alerts'
  const [sortBy, setSortBy] = useState('Latest'); // 'Latest' | 'Priority' | 'Category'
  const [searchQuery, setSearchQuery] = useState('');

  // Toggles for Quick Settings
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  // Dropdown states for each item (by ID)
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Modal for security review
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Stats calculation
  const totalCount = notifications.length;
  const unreadCount = notifications.filter(n => n.unread).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && n.unread).length;
  const todayCount = notifications.filter(n => n.dateGroup === 'today').length;

  const handleTakeNow = (id) => {
    showToast('Amoxicillin 500mg dose logged and confirmed!', 'success');
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false, action: null } : n));
  };

  const handleReviewActivity = () => {
    setIsSecurityModalOpen(true);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    showToast('Notification marked as read.', 'info');
    setActiveDropdown(null);
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted.', 'info');
    setActiveDropdown(null);
  };

  const handleArchive = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification archived successfully.', 'success');
    setActiveDropdown(null);
  };

  // Filtering Logic
  const filteredNotifications = notifications.filter(n => {
    // Search Query match
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category / Filter button match
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
    return 0; // Maintain latest / default order
  });

  const todayItems = filteredNotifications.filter(n => n.dateGroup === 'today');
  const yesterdayItems = filteredNotifications.filter(n => n.dateGroup === 'yesterday');

  const user = useAuthStore((state) => state.user);

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

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

          {/* SideNavBar - Desktop only (matches Stitch Layout style) */}
          {/* <SideNavbar activeRoute="#notifications" /> */}

          {/* Main workspace */}
          <div className="flex-1 w-full space-y-8 text-left">

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
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-white transition-all shadow-sm"
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
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-500"><MailWarning className="w-4 h-4" /></div>
                </div>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">{unreadCount}</div>
              </Card>

              {/* High Priority Stat with Red Pulse Alert */}
              <Card variant="glass" className={`p-5 flex flex-col gap-2 shadow-sm transition-all relative overflow-hidden ${highPriorityCount > 0 ? 'ring-1 ring-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.05)]' : ''
                }`}>
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
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">{todayCount}</div>
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
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="relative w-full sm:w-auto shrink-0 flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Sort By:</span>
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

            {/* Notification Feed & Sidebar Panel */}
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
                        className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all relative overflow-hidden group ${item.priority === 'high'
                            ? 'border-rose-250 dark:border-rose-900/50 shadow-[0_4px_20px_rgba(244,63,94,0.05)]'
                            : 'border-slate-200 dark:border-slate-850 hover:shadow-md'
                          }`}
                      >
                        {item.priority === 'high' && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                        )}
                        <div className="flex gap-4">
                          {/* Category Badge Icon */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.priority === 'high'
                              ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500'
                              : item.category === 'Prescription'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                                : 'bg-primary/10 text-primary'
                            }`}>
                            {item.category === 'Reminders' && <MaterialIcon name="alarm" size="sm" />}
                            {item.category === 'Prescription' && <CheckCircle2 className="w-5 h-5" />}
                            {item.category === 'System' && <Sparkles className="w-5 h-5" />}
                          </div>

                          {/* Body Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.priority === 'high'
                                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
                                    : item.category === 'Prescription'
                                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                  }`}>
                                  {item.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                              </div>

                              {/* Dropdown Options Menu */}
                              <div className="relative">
                                <button
                                  onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {activeDropdown === item.id && (
                                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-1 z-20 text-xs">
                                    {item.unread && (
                                      <button onClick={() => handleMarkAsRead(item.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Mark Read
                                      </button>
                                    )}
                                    <button onClick={() => handleArchive(item.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                      <Archive className="w-3.5 h-3.5 text-slate-400" /> Archive
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-rose-500 font-medium flex items-center gap-2 border-t border-slate-100 dark:border-slate-900">
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

                            {item.action === 'take_now' && (
                              <Button
                                variant="primary"
                                onClick={() => handleTakeNow(item.id)}
                                className="mt-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-1.5 px-4 rounded-lg shadow-sm"
                              >
                                Take Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Yesterday Items */}
                <div className="space-y-3 mt-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span>Yesterday</span>
                    <span className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></span>
                  </h3>

                  {yesterdayItems.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No matching notifications for yesterday.</p>
                  ) : (
                    yesterdayItems.map(item => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                      >
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                            {item.category === 'Security' && <Shield className="w-5 h-5 text-indigo-500" />}
                            {item.category === 'Admin' && <MaterialIcon name="admin_panel_settings" size="sm" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-500">
                                  {item.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                              </div>

                              {/* Action Dropdown Menu */}
                              <div className="relative">
                                <button
                                  onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {activeDropdown === item.id && (
                                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl py-1 z-20 text-xs">
                                    <button onClick={() => handleArchive(item.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                      <Archive className="w-3.5 h-3.5 text-slate-400" /> Archive
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-rose-500 font-medium flex items-center gap-2 border-t border-slate-100 dark:border-slate-900">
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">{item.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>

                            {item.action === 'review_activity' && (
                              <Button
                                variant="outline"
                                onClick={handleReviewActivity}
                                className="mt-3.5 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 py-1.5 px-4 rounded-lg font-bold text-xs"
                              >
                                Review Activity
                              </Button>
                            )}
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
                <Card variant="glass" className="p-6">
                  <h3 className="text-sm font-black text-slate-850 dark:text-white mb-5 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-400" /> Quick Settings
                  </h3>
                  <div className="space-y-5">

                    {/* Toggle 1 */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white">Push Notifications</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Desktop & Mobile</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setPushEnabled(!pushEnabled); showToast(`Push notifications ${!pushEnabled ? 'enabled' : 'disabled'}`, 'info'); }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative shrink-0 ${pushEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${pushEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </button>
                    </div>

                    {/* Toggle 2 */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white">Email Digests</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Daily summaries</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setEmailEnabled(!emailEnabled); showToast(`Email digests ${!emailEnabled ? 'enabled' : 'disabled'}`, 'info'); }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative shrink-0 ${emailEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${emailEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </button>
                    </div>

                    {/* Toggle 3 */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white">SMS Alerts</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">High priority only</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSmsEnabled(!smsEnabled); showToast(`SMS alerts ${!smsEnabled ? 'enabled' : 'disabled'}`, 'info'); }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative shrink-0 ${smsEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${smsEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </button>
                    </div>

                  </div>
                </Card>

                {/* Role Status */}
                <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center gap-2 text-primary font-bold mb-1">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Role-Based Overview</h3>
                  </div>

                  <div className="bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-850 flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Clinical Staff</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30"></span>
                  </div>

                  <div className="bg-white/40 dark:bg-slate-950/20 rounded-xl p-3 border border-slate-200 dark:border-slate-850/80 flex justify-between items-center opacity-60 cursor-not-allowed">
                    <span className="text-xs font-medium text-slate-400">System Admin</span>
                    <MaterialIcon name="lock" size="xs" className="text-slate-400" />
                  </div>
                </div>

                {/* Quiet Hours */}
                <Card variant="glass" className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-white">Quiet Hours</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">Notifications are automatically silent outside defined clinical shift hours.</p>

                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl">
                    <span className="text-xs font-black text-slate-800 dark:text-white font-mono">20:00 - 06:00</span>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded text-[9px] font-black uppercase tracking-wider">Active</span>
                  </div>
                </Card>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Security Activity Modal */}
      <AnimatePresence>
        {isSecurityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500 animate-bounce" /> Review Activity Login
                </h3>
                <button onClick={() => setIsSecurityModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 text-left space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  A secure login verification request was triggered. The platform detected a login session from:
                </p>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850 space-y-2 text-xs font-medium">
                  <p><span className="text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">IP Address:</span> 103.220.14.88</p>
                  <p><span className="text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">Location:</span> Mumbai, Maharashtra, IN</p>
                  <p><span className="text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">Device:</span> Chrome v121 on Windows 11</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => { showToast('Device logged out and flagged successfully.', 'success'); setIsSecurityModalOpen(false); }}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-xs"
                  >
                    Flag & Log Out
                  </Button>
                  <Button
                    onClick={() => { showToast('Session verified and whitelisted.', 'success'); setIsSecurityModalOpen(false); }}
                    className="flex-1 border-slate-250 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350"
                  >
                    Yes, It Was Me
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
