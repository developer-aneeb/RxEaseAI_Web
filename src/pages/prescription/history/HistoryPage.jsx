import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/useAuthStore';
import { useAppStore } from '../../../store/useAppStore';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import MaterialIcon from '../../../components/ui/MaterialIcon';
import Navbar from '../../../components/layout/Navbar';
import Spinner from '../../../components/ui/Spinner';
import Modal from '../../../components/ui/Modal';
import { usePrescriptionStore } from '../../../store/usePrescriptionStore';
import {
  Search, Eye, Download, MoreVertical, Edit2,
  Trash2, X, ZoomIn, ChevronLeft, ChevronRight,
  Share2, Clipboard, Check, Send
} from 'lucide-react';
import { prescriptionService } from '../../../services/prescriptionService';
import { shareService } from '../../../services/shareService';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';
import DownloadModal from '../components/DownloadModal';
import ShareModal from '../components/ShareModal';

export default function HistoryPage() {
  const user = useAuthStore((state) => state.user);
  const showToast = useAppStore((state) => state.showToast);

  const [prescriptions, setPrescriptions] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Verified' | 'Needs Review'
  const [timeFilter, setTimeFilter] = useState('All'); // 'All' | 'Today' | 'This Week'

  const [selectedImage, setSelectedImage] = useState(null); // Fullscreen preview modal
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Bulk / Share / Download / Expiry State
  const [selectedIds, setSelectedIds] = useState([]);
  const [shareData, setShareData] = useState(null); // null or { type: 'single' | 'bulk', ids: [...] }
  const [downloadData, setDownloadData] = useState(null); // null or prescription object or array of objects/IDs

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const [rxResponse, historyResponse] = await Promise.all([
        prescriptionService.listPrescriptions(),
        prescriptionService.getHistory().catch(() => [])
      ]);

      const rxList = Array.isArray(rxResponse)
        ? rxResponse
        : (rxResponse?.data || rxResponse?.prescriptions || []);
      setPrescriptions(rxList);
      setHistoryLogs(Array.isArray(historyResponse) ? historyResponse : []);
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
    const originalUrl = imageObject.original_image_url || null;

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

  // Pagination bounds calculation
  const totalFilteredCount = filteredHistory.length;
  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredHistory.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = (id) => {
    const target = normalizedPrescriptions.find(p => p.id === id) || { id };
    setDownloadData(target);
  };

  const handleDownloadMultiple = () => {
    if (selectedIds.length === 0) return;
    const targets = selectedIds.map(id => normalizedPrescriptions.find(p => p.id === id) || { id });
    setDownloadData(targets);
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

  const formatAction = (action, meta) => {
    switch (action) {
      case 'uploaded':
        return 'Uploaded prescription document';
      case 'extracted':
        return 'Ran AI analysis on script';
      case 'exported':
        return meta?.combined_export
          ? `Exported combined PDF (${meta.total_prescriptions} scripts)`
          : 'Exported prescription PDF';
      case 'shared':
        return `Shared report with ${meta?.shared_with_email || 'recipient'}`;
      default:
        return `${action.charAt(0).toUpperCase() + action.slice(1)} prescription`;
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'uploaded':
        return 'upload_file';
      case 'extracted':
        return 'psychology';
      case 'exported':
        return 'picture_as_pdf';
      case 'shared':
        return 'share';
      default:
        return 'info';
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'Search', href: '#search' },
    { name: 'Reminders', href: '#reminders' },
    { name: 'Recommendations', href: '#recommendations' },
    { name: 'Prescription Analytics', href: '#prescription-analytics' },
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
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all focus:outline-none"
                />
              </div>

              <div className="flex gap-4 w-full md:w-auto items-center flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
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
                    onChange={(e) => { setTimeFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
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
                      {/* <div
                        onClick={() => setSelectedImage(item.image)}
                        className="w-20 h-24 bg-slate-100 dark:bg-slate-955 rounded-xl shrink-0 overflow-hidden relative group border border-slate-200/50 dark:border-slate-800 cursor-zoom-in"
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
                      </div> */}

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
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-955 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-850 hover:text-primary transition-colors cursor-pointer border-0"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShareData({ type: 'single', ids: [item.id] })}
                          className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-955 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-850 hover:text-primary transition-colors cursor-pointer border-0"
                          title="Share Prescription"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1.5 rounded-lg text-slate-455 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer border-0 bg-transparent"
                          title="More Options"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Options Menu */}
                        {activeMenuId === item.id && (
                          <div className="absolute right-0 top-10 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-20 min-w-[120px]">
                            <button
                              onClick={() => {
                                prescriptionService.getPrescriptionDetails(item.id).then(res => {
                                  usePrescriptionStore.getState().setAiResult(res);
                                  usePrescriptionStore.getState().setCurrentPrescription(item.image);
                                  window.location.hash = '#result';
                                });
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg flex items-center gap-1.5 border-0 bg-transparent cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              View/Audit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(item.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-[10px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955/20 rounded-lg flex items-center gap-1.5 border-0 bg-transparent cursor-pointer"
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
                              : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400'
                              }`}
                          >
                            {m.name}
                          </span>
                        ))}
                        {item.medicines.length > 2 && (
                          <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded text-[9px] font-bold text-slate-450">
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
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200">No prescriptions found</h3>
                    <p className="text-xs text-slate-400 mt-1">Try uploading a new prescription or adjusting filters.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalFilteredCount > 0 && (
              <div className="p-4 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 font-bold outline-none text-slate-800 dark:text-white cursor-pointer"
                  >
                    <option value={4}>4 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                  <span>of {totalFilteredCount} matching</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors cursor-pointer border-0 bg-transparent ${currentPage === idx + 1
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'border border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Sidebar (Recent Activity & Stats) */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">

            {/* Quick Statistics */}
            <div className="glassmorphism p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <h3 className="text-sm font-bold text-slate-855 dark:text-slate-100 mb-6 flex items-center gap-2">
                <MaterialIcon name="analytics" size="sm" className="text-primary" />
                <span>Quick Statistics</span>
              </h3>

              <div className="flex flex-col gap-4 text-left font-geist">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Total Ingested</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">{normalizedPrescriptions.length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-955 border border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Fully Verified</span>
                  <span className="text-base font-extrabold text-emerald-500">{normalizedPrescriptions.filter(p => p.status === 'Verified').length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-955 border border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Needs Review</span>
                  <span className="text-base font-extrabold text-amber-500">{normalizedPrescriptions.filter(p => p.status === 'Needs Review').length}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="glassmorphism p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <h3 className="text-sm font-bold text-slate-855 dark:text-slate-100 mb-6 flex items-center gap-2">
                <MaterialIcon name="history" size="sm" className="text-primary" />
                <span>Recent Activity Log</span>
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {historyLogs.slice(0, 8).map((log) => {
                  const dateStr = log.created_at
                    ? new Date(log.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '';
                  return (
                    <div key={log.id} className="flex gap-3 text-left">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center shrink-0 text-slate-500">
                        <MaterialIcon name={getActionIcon(log.action)} size="xs" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                          {formatAction(log.action, log.metadata)}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{dateStr} • ID: #{log.prescription_id}</p>
                      </div>
                    </div>
                  );
                })}
                {historyLogs.length === 0 && (
                  <p className="text-xs text-slate-405 text-center py-6">No recent actions recorded.</p>
                )}
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

              <div className="w-full aspect-[3/4] bg-slate-50 dark:bg-slate-955 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
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
                className="w-4 h-4 rounded text-indigo-655 focus:ring-indigo-500/25 cursor-pointer accent-indigo-600"
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
                className="flex items-center gap-1.5 text-xs font-bold py-2 px-3 hover:bg-slate-50 dark:hover:bg-slate-855"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Combined PDF</span>
              </Button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-xs font-bold text-slate-455 hover:text-slate-600 p-2 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Share Prescription Modal */}
      <ShareModal
        isOpen={!!shareData}
        onClose={() => setShareData(null)}
        prescription={shareData?.ids || null}
        onSuccess={() => {
          fetchPrescriptions();
        }}
      />

      {/* Reusable Download Prescription Modal */}
      <DownloadModal
        isOpen={!!downloadData}
        onClose={() => setDownloadData(null)}
        prescriptions={downloadData || []}
        onSuccess={() => {
          if (Array.isArray(downloadData) && downloadData.length > 1) {
            setSelectedIds([]);
          }
          fetchPrescriptions();
        }}
      />
    </div>
  );
}
