import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import {
  Search, Eye, Download, MoreVertical, Edit2,
  Trash2, X, ZoomIn, CheckCircle2, AlertTriangle,
  History, Settings, Bell, ChevronLeft, ChevronRight,
  TrendingUp, Activity, ShieldAlert, Share2, Clipboard,
  Check, Mail, Send
} from 'lucide-react';
import { prescriptionService } from '../../services/prescriptionService';
import { shareService } from '../../services/shareService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

export default function HistoryPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Verified' | 'Needs Review'
  const [timeFilter, setTimeFilter] = useState('All'); // 'All' | 'Today' | 'This Week'
  
  const [selectedImage, setSelectedImage] = useState(null); // Fullscreen preview modal
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Bulk / Share / Expiry State
  const [selectedIds, setSelectedIds] = useState([]);
  const [shareData, setShareData] = useState(null); // null or { type: 'single' | 'bulk', ids: [...] }
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [generatedShareToken, setGeneratedShareToken] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const itemsPerPage = 4;

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await prescriptionService.listPrescriptions();
      // Backend returns prescriptions array directly or inside { success, data }
      const list = Array.isArray(response) 
        ? response 
        : (response?.data || response?.prescriptions || []);
      setPrescriptions(list);
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to fetch prescription history.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Normalize API data to UI format
  const normalizedPrescriptions = prescriptions.map((item) => {
    const pId = item.prescription_id;
    const dateParsed = item.created_at ? new Date(item.created_at) : new Date();
    const dateStr = dateParsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const items = item.prescription_items || [];
    const isVerified = items.every(i => i.validation_confidence >= 0.75) && items.length > 0;
    
    // Get average confidence
    const totalConfidence = items.reduce((sum, i) => sum + (i.validation_confidence || 0.5), 0);
    const avgConfidence = items.length > 0 ? (totalConfidence / items.length) : 0.8;
    const ocrMatch = Math.round(avgConfidence * 100) + '%';
    
    const imageObject = item.prescription_images || item.prescription_image || {};
    const originalUrl = imageObject.original_image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDxQMub5mJyvN_Cs0E38s9xswudAcqO5X1pfkR06mQ9H4cANALe-RShm66y8uZrtbGXITAnGU97gPcBG1HxPMouEpayXk9lS22aks08N7qc7YlAHbY-EvpD3oNl4In5MZ2NyErdZsiluw6XQInHb8yI7WwG9iwPRHJ53GA0uiY7rjQrckh6NpKndXo1NcYuzwLkVt6b9_qycEBm2s1OqplznGTFBvEM-BanNk-3yg9r5V04hqDvsjQmXGhkPhJBH2VpyjGKxj35ek';

    return {
      id: pId,
      doctor: item.doctor_name || 'AI Extraction Pipeline',
      department: item.medical_notes || 'Handwritten Prescription',
      date: dateStr,
      rawDate: dateParsed,
      medicinesCount: items.length,
      medicines: items.map(i => ({
        name: i.medicine_name,
        status: i.validation_confidence < 0.6 ? 'warning' : 'normal'
      })),
      ocrMatch,
      status: isVerified ? 'Verified' : 'Needs Review',
      image: originalUrl
    };
  });

  // Filter and Search Logic
  const filteredHistory = normalizedPrescriptions.filter((item) => {
    const matchesSearch =
      item.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.medicines.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;

    let matchesTime = true;
    const now = new Date();
    const itemDate = item.rawDate;
    if (timeFilter === 'Today') {
      matchesTime = itemDate.toDateString() === now.toDateString();
    } else if (timeFilter === 'This Week') {
      const diffTime = Math.abs(now - itemDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      matchesTime = diffDays <= 7;
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = async (id) => {
    setIsExporting(true);
    showToast(`Generating PDF audit report...`, 'info');
    try {
      const blob = await prescriptionService.exportPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast(`Successfully downloaded prescription report!`, 'success');
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to download prescription PDF.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadMultiple = async () => {
    if (selectedIds.length === 0) return;
    setIsExporting(true);
    const count = selectedIds.length;
    showToast(`Generating combined PDF for ${count} prescriptions...`, 'info');
    try {
      const blob = await prescriptionService.exportMultiplePDF(selectedIds);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `combined_prescription_reports.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast(`Successfully exported ${count} prescriptions to PDF!`, 'success');
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to export bulk prescriptions PDF.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription from history?')) return;
    try {
      await prescriptionService.deletePrescription(id);
      showToast('Prescription deleted successfully.', 'success');
      fetchPrescriptions();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to delete prescription.');
      showToast(friendlyMsg, 'error');
    }
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!recipientEmail) return;
    setIsSharing(true);
    try {
      const mainId = shareData.ids[0];
      const result = await shareService.sharePrescription(mainId, recipientEmail);
      const token = result.share_token || result.token;
      
      setGeneratedShareToken(token);
      showToast(`Prescription report successfully emailed to ${recipientEmail}!`, 'success');
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to share prescription.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
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

          {/* Main Content Area */}
          <div className="flex-1 w-full space-y-6">

            {/* Header section */}
            <div className="bg-white/70 dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-md text-left">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">Prescription History</h2>
                <p className="text-xs text-slate-500 mt-1">Review, search, export and manage your past AI-ingested medical prescriptions.</p>
              </div>
              <Button
                variant="primary"
                onClick={() => window.location.hash = '#upload'}
                className="bg-primary hover:bg-primary-container text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
              >
                <MaterialIcon name="upload" size="sm" />
                <span>Upload Prescription</span>
              </Button>
            </div>

            {/* Filters Row */}
            <div className="bg-white/50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 text-left">
              <div className="relative w-full md:w-[280px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctor, drug name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all focus:outline-none"
                />
              </div>

              <div className="flex gap-4 w-full md:w-auto items-center flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Verified">Verified</option>
                    <option value="Needs Review">Needs Review</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time:</span>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="All">All Time</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ingestion Table/List */}
            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedItems.map((item) => (
                  <Card
                    key={item.id}
                    variant="glass"
                    className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg relative flex flex-col gap-4 text-left group"
                  >
                    <div className="flex gap-3.5 items-start">
                      {/* Checkbox for Bulk Actions */}
                      <div className="pt-1 shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4.5 h-4.5 rounded-lg border-slate-200 dark:border-slate-800 text-indigo-650 focus:ring-indigo-500/25 cursor-pointer accent-indigo-600"
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
                      <div className="flex-1 min-w-0 text-left">
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

                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-450">
                          <span className="flex items-center gap-1"><MaterialIcon name="calendar_today" size="xs" /> {item.date}</span>
                          <span className="flex items-center gap-1"><MaterialIcon name="pill" size="xs" /> {item.medicinesCount} Medicines</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-1.5 shrink-0 relative">
                        <button
                          onClick={() => {
                            // Redirect to result page loaded with this prescription's data
                            prescriptionService.getPrescriptionDetails(item.id).then(res => {
                              usePrescriptionStore.getState().setAiResult(res);
                              usePrescriptionStore.getState().setCurrentPrescription(item.image);
                              window.location.hash = '#result';
                            });
                          }}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-850 hover:text-primary transition-colors cursor-pointer border-0"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(item.id)}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-850 hover:text-primary transition-colors cursor-pointer border-0"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShareData({ type: 'single', ids: [item.id] })}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-850 hover:text-primary transition-colors cursor-pointer border-0"
                          title="Share Prescription"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1.5 rounded-lg text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer border-0 bg-transparent"
                          title="More Options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Options Menu */}
                        {activeMenuId === item.id && (
                          <div className="absolute right-0 top-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-20 min-w-[120px]">
                            <button
                              onClick={() => {
                                prescriptionService.getPrescriptionDetails(item.id).then(res => {
                                  usePrescriptionStore.getState().setAiResult(res);
                                  usePrescriptionStore.getState().setCurrentPrescription(item.image);
                                  window.location.hash = '#result';
                                });
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg flex items-center gap-1.5 border-0 bg-transparent"
                            >
                              <Edit2 className="w-3 h-3" />
                              View/Audit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(item.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg flex items-center gap-1.5 border-0 bg-transparent"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer tag summary */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-805/80 flex items-center justify-between gap-2 flex-wrap">
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
                        <span>{item.ocrMatch} Avg Match</span>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredHistory.length === 0 && (
                  <div className="col-span-2 py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-md">
                    <MaterialIcon name="search_off" size="3xl" className="text-slate-350 dark:text-slate-600 mb-4" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No prescriptions found</h3>
                    <p className="text-xs text-slate-400 mt-1">Try uploading a new prescription or adjusting filters.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between py-4 px-2">
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider">
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
                      className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors cursor-pointer border-0 ${currentPage === idx + 1
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white'
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

          {/* Secondary Sidebar (Recent Activity Feed) */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="glassmorphism p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <MaterialIcon name="history" size="sm" className="text-primary" />
                <span>Quick Statistics</span>
              </h3>

              <div className="flex flex-col gap-4 text-left font-geist">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Total Ingested</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">{normalizedPrescriptions.length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Fully Verified</span>
                  <span className="text-base font-extrabold text-emerald-500">{normalizedPrescriptions.filter(p => p.status === 'Verified').length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Needs Review</span>
                  <span className="text-base font-extrabold text-amber-500">{normalizedPrescriptions.filter(p => p.status === 'Needs Review').length}</span>
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
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer border-0"
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
                <span>Combined PDF</span>
              </Button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs font-bold text-slate-450 hover:text-slate-600 p-2 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Prescription Modal */}
      <Modal
        isOpen={!!shareData}
        onClose={() => {
          setShareData(null);
          setGeneratedShareToken(null);
          setRecipientEmail('');
        }}
        title="Share Prescription Report"
      >
        {!generatedShareToken ? (
          <form onSubmit={handleShareSubmit} className="flex flex-col gap-4 font-sans text-left">
            <p className="text-xs text-slate-500 leading-relaxed">
              We will generate a secure access token and email the medical audit details (including a PDF copy) directly to the recipient address below.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-400">Recipient Email Address</label>
              <input
                type="email"
                placeholder="doctor@hospital.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
              />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareData(null)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSharing}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                {isSharing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Email Report</span>
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4 text-left font-sans">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Secure sharing record established successfully!</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Public Share Link</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-700 dark:text-slate-350 truncate font-mono select-all">
                  {`${window.location.origin}/api/v1/share/share/${generatedShareToken}`}
                </span>
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/api/v1/share/share/${generatedShareToken}`;
                    navigator.clipboard.writeText(link);
                    setShareLinkCopied(true);
                    showToast('Link copied to clipboard!', 'success');
                    setTimeout(() => setShareLinkCopied(false), 2000);
                  }}
                  className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {shareLinkCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Any person with this link will be able to retrieve the clinical prescription items directly from our database.
            </p>
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShareData(null);
                  setGeneratedShareToken(null);
                  setRecipientEmail('');
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
