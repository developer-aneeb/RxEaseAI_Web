import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrescriptionStore } from '../../store/usePrescriptionStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';
import SideNavbar from '../../components/layout/SideNavbar';
import {
  Search, Eye, Download, MoreVertical, Edit2,
  Trash2, X, ZoomIn, CheckCircle2, AlertTriangle,
  History, Settings, Bell, ChevronLeft, ChevronRight,
  TrendingUp, Activity, ShieldAlert, Share2, Clipboard,
  Check, Mail, Send
} from 'lucide-react';

export default function HistoryPage() {
  const { history, addHistoryEntry, resetStore } = usePrescriptionStore();
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Verified' | 'Needs Review'
  const [timeFilter, setTimeFilter] = useState('All'); // 'All' | 'Today' | 'This Week'
  const [selectedImage, setSelectedImage] = useState(null); // Fullscreen preview modal
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Download & Share Multi-select state
  const [selectedIds, setSelectedIds] = useState([]);
  const [shareData, setShareData] = useState(null); // null or { type: 'single' | 'bulk', items: [...] }
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [shareExpiry, setShareExpiry] = useState('24h');

  const itemsPerPage = 4;

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Filter and Search Logic
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.medicines.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;

    let matchesTime = true;
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (timeFilter === 'Today') {
      matchesTime = item.date.includes('Oct 24') || item.date === todayStr;
    } else if (timeFilter === 'This Week') {
      // Simple mock filter logic
      matchesTime = item.date.includes('Oct') || item.date === todayStr;
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = (doctor) => {
    showToast(`Generating and downloading PDF audit report for ${doctor}...`, 'info');
  };

  const handleDownloadMultiple = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    showToast(`Generating bulk archive for ${count} prescriptions...`, 'info');
    setTimeout(() => {
      showToast(`Successfully exported ${count} prescriptions to PDF_Prescriptions_Archive.zip`, 'success');
      setSelectedIds([]);
    }, 1500);
  };

  const handleShareMultiple = () => {
    if (selectedIds.length === 0) return;
    const selectedItems = history.filter(item => selectedIds.includes(item.id));
    setShareData({
      type: 'bulk',
      items: selectedItems
    });
  };

  const handleShareSingle = (item) => {
    setShareData({
      type: 'single',
      items: [item]
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    // Filter to only select currently visible items on the page
    const visibleIds = paginatedItems.map(item => item.id);
    const allVisibleSelected = visibleIds.every(id => selectedIds.includes(id));

    if (allVisibleSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...visibleIds])]);
    }
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

      {/* Grid background & ambient glow */}
      <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-50 dark:opacity-30"></div>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] mix-blend-multiply opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* SideNavBar - Desktop only (matches Stitch Layout style but custom styled for our dark/light layout) */}
          {/* <SideNavbar activeRoute="#history" /> */}

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">

            {/* Header Section */}
            <div className="glassmorphism p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] tracking-wide uppercase mb-3 border border-primary/20">
                  <MaterialIcon name="local_pharmacy" size="xs" />
                  <span>Prescription Management</span>
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
                  Prescription History
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-2 max-w-xl">
                  Access, organize, review, and manage all of your AI-processed prescriptions in one secure, compliant workspace.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => window.location.hash = '#upload'}
                className="bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <MaterialIcon name="upload_file" size="sm" />
                <span>+ Upload New Prescription</span>
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Card 1 */}
              <Card variant="flat" className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl text-primary">
                    <MaterialIcon name="receipt_long" size="md" />
                  </div>
                  <span className="text-emerald-500 font-bold text-xs flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+12%</span>
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Prescriptions</p>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">245</h3>
                </div>
              </Card>

              {/* Card 2 */}
              <Card variant="flat" className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow border-l-2 border-l-tertiary">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-tertiary/10 rounded-xl text-tertiary">
                    <MaterialIcon name="smart_toy" size="md" />
                  </div>
                  <Badge variant="info">This Month</Badge>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AI Processed</p>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">32</h3>
                </div>
              </Card>

              {/* Card 3 */}
              <Card variant="flat" className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <MaterialIcon name="verified" size="md" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Verified Medicines</p>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">684</h3>
                </div>
              </Card>

              {/* Card 4 */}
              <Card variant="flat" className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500">
                    <MaterialIcon name="notification_important" size="md" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Upcoming Reminders</p>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">14</h3>
                </div>
              </Card>
            </div>

            {/* List & Filters Section */}
            <div className="space-y-4">

              {/* Search and filter controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-md">
                <div className="flex-1 w-full relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Filter medicines, doctors, or status..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-colors focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto justify-end">
                  <button
                    onClick={() => {
                      setTimeFilter(timeFilter === 'Today' ? 'All' : 'Today');
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${timeFilter === 'Today'
                        ? 'border-primary/30 text-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      setTimeFilter(timeFilter === 'This Week' ? 'All' : 'This Week');
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${timeFilter === 'This Week'
                        ? 'border-primary/30 text-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                  >
                    This Week
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setFilterStatus(filterStatus === 'All' ? 'Verified' : filterStatus === 'Verified' ? 'Needs Review' : 'All')}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Status: {filterStatus}</span>
                      <MaterialIcon name="arrow_drop_down" size="xs" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of Prescription Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedItems.map((item) => (
                  <Card
                    key={item.id}
                    variant="glass"
                    className="p-5 flex flex-col gap-4 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md"
                  >
                    <div className="flex gap-3.5 items-start">
                      {/* Checkbox for Bulk Actions */}
                      <div className="pt-10 shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4.5 h-4.5 rounded-lg border-slate-200 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500/25 cursor-pointer accent-indigo-600"
                        />
                      </div>

                      {/* Document Preview Thumbnail */}
                      <div
                        onClick={() => setSelectedImage(item.image)}
                        className="w-20 h-24 bg-slate-100 dark:bg-slate-950 rounded-xl shrink-0 overflow-hidden relative group border border-slate-200/50 dark:border-slate-800 cursor-zoom-in"
                      >
                        {item.image.startsWith('data:image/svg') ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: decodeURIComponent(item.image.split(',')[1] || item.image) }}
                            className="w-full h-full object-cover scale-95 origin-top"
                          />
                        ) : (
                          <img
                            src={item.image}
                            alt="Prescription Thumbnail"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Info & Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{item.doctor}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border shrink-0 ${item.status === 'Verified'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                            }`}>
                            <MaterialIcon name={item.status === 'Verified' ? 'check_circle' : 'warning'} size="xs" />
                            <span>{item.status}</span>
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mb-3">{item.department}</p>

                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-550">
                          <span className="flex items-center gap-1"><MaterialIcon name="calendar_today" size="xs" /> {item.date}</span>
                          <span className="flex items-center gap-1"><MaterialIcon name="pill" size="xs" /> {item.medicinesCount} Medicines</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-1.5 shrink-0 relative">
                        <button
                          onClick={() => setSelectedImage(item.image)}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-850 hover:text-primary transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(item.doctor)}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-850 hover:text-primary transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleShareSingle(item)}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-850 hover:text-primary transition-colors cursor-pointer"
                          title="Share Prescription"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Options Menu */}
                        {activeMenuId === item.id && (
                          <div className="absolute right-0 top-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-20 min-w-[120px]">
                            <button
                              onClick={() => {
                                showToast('Manual clinical review triggered', 'info');
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg flex items-center gap-1.5"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit Record
                            </button>
                            <button
                              onClick={() => {
                                showToast('Audit checklist verified', 'success');
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Force Verify
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer tag summary */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex gap-1.5 flex-wrap">
                        {item.medicines.slice(0, 2).map((m, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold shadow-sm ${m.status === 'warning'
                                ? 'bg-rose-500/5 text-rose-500 border border-rose-500/10'
                                : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                          >
                            {m.name}
                          </span>
                        ))}
                        {item.medicines.length > 2 && (
                          <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 rounded text-[9px] font-bold text-slate-450">
                            +{item.medicines.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[9px] font-extrabold text-tertiary bg-tertiary/5 px-2 py-0.5 rounded-full border border-tertiary/10 tracking-wide">
                        <MaterialIcon name="document_scanner" size="xs" />
                        <span>{item.ocrMatch} OCR Match</span>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredHistory.length === 0 && (
                  <div className="col-span-2 py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-md">
                    <MaterialIcon name="search_off" size="3xl" className="text-slate-350 dark:text-slate-655 mb-4" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching prescriptions found</h3>
                    <p className="text-xs text-slate-450 mt-1">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4 px-2">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredHistory.length)} of {filteredHistory.length} entries
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${currentPage === idx + 1
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white'
                          }`}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Secondary Sidebar (Recent Activity Feed) */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="glassmorphism p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <MaterialIcon name="history" size="sm" className="text-primary" />
                <span>Recent Activity</span>
              </h3>

              <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">

                {/* Activity Item 1 */}
                <div className="relative">
                  <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-primary border-2 border-white dark:border-slate-900 shadow-md mt-1"></div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">Prescription Captured</p>
                  <p className="text-[11px] text-slate-500 mb-1">Dr. Sarah Jenkins Snapped</p>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">10 mins ago</span>
                </div>

                {/* Activity Item 2 */}
                <div className="relative">
                  <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-white dark:border-slate-900 shadow-md mt-1"></div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5 flex items-center gap-1">
                    <span>AI Processing Complete</span>
                    <MaterialIcon name="auto_awesome" size="xs" className="text-tertiary" />
                  </p>
                  <p className="text-[11px] text-slate-500 mb-1">2 medicines extracted successfully.</p>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">12 mins ago</span>
                </div>

                {/* Activity Item 3 */}
                <div className="relative">
                  <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900 shadow-md mt-1"></div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">PDF Downloaded</p>
                  <p className="text-[11px] text-slate-500 mb-1">Previous record accessed.</p>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">2 hours ago</span>
                </div>

              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Lightbox / Fullscreen Document Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 pr-8">
                Prescription Source Document Preview
              </h3>

              <div className="w-full aspect-[3/4] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                {selectedImage.startsWith('data:image/svg') ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: decodeURIComponent(selectedImage.split(',')[1] || selectedImage) }}
                    className="w-full h-full p-6 object-contain flex items-center justify-center"
                  />
                ) : (
                  <img
                    src={selectedImage}
                    alt="Prescription Document Fullscreen"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    showToast('Initiating medical grade document export...', 'success');
                    setSelectedImage(null);
                  }}
                  className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary-container"
                >
                  Export PDF
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 dark:bg-slate-900/95 border border-slate-250 dark:border-slate-800 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 backdrop-blur-md max-w-lg w-[calc(100%-2rem)] justify-between"
          >
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedIds.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-indigo-650 focus:ring-indigo-500/25 cursor-pointer accent-indigo-600"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-250">
                {selectedIds.length} Selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadMultiple}
                className="flex items-center gap-1.5 text-xs font-bold py-2 px-3 hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleShareMultiple}
                className="flex items-center gap-1.5 text-xs font-bold py-2 px-3 bg-indigo-650 hover:bg-indigo-600 text-white"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </Button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 p-2 rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Prescription Modal */}
      <AnimatePresence>
        {shareData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShareData(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <button
                onClick={() => setShareData(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {shareData.type === 'bulk' ? 'Share Selected Prescriptions' : 'Share Prescription'}
                </h3>
                <p className="text-xs text-slate-450 mt-1">
                  {shareData.type === 'bulk'
                    ? `Generating a secure share link for ${shareData.items.length} records.`
                    : `Share diagnostic records from ${shareData.items[0]?.doctor || 'provider'}.`}
                </p>
              </div>

              {/* Share link box */}
              <div className="space-y-4">
                <div className="bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-3.5 relative flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Secure Share Link</p>
                    <p className="text-xs text-slate-700 dark:text-slate-200 truncate font-mono">
                      {shareData.type === 'bulk'
                        ? `https://rxeaseai.med/share/bulk?ids=${shareData.items.map(i => i.id).join(',')}`
                        : `https://rxeaseai.med/share/${shareData.items[0]?.id}`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const link = shareData.type === 'bulk'
                        ? `https://rxeaseai.med/share/bulk?ids=${shareData.items.map(i => i.id).join(',')}`
                        : `https://rxeaseai.med/share/${shareData.items[0]?.id}`;
                      navigator.clipboard.writeText(link);
                      setShareLinkCopied(true);
                      showToast('Secure link copied to clipboard!', 'success');
                      setTimeout(() => setShareLinkCopied(false), 2050);
                    }}
                    className="p-2 bg-indigo-50 dark:bg-slate-850 hover:bg-indigo-100 text-indigo-650 dark:text-indigo-400 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Copy Link"
                  >
                    {shareLinkCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expiry selection */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Access Expiry</label>
                  <select
                    value={shareExpiry}
                    onChange={(e) => setShareExpiry(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-colors focus:outline-none"
                  >
                    <option value="1h">1 Hour (Highly Secure)</option>
                    <option value="24h">24 Hours (Standard)</option>
                    <option value="7d">7 Days</option>
                    <option value="never">No Expiry</option>
                  </select>
                </div>

                {/* Sharing actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      showToast('Inviting secure recipient via Email...', 'success');
                      setShareData(null);
                    }}
                    className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>Share via Email</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast('Sharing link via secure messaging...', 'success');
                      setShareData(null);
                    }}
                    className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4 text-emerald-500" />
                    <span>Share via WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button variant="outline" onClick={() => setShareData(null)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
