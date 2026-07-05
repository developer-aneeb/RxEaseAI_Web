import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Spinner from '../../components/ui/Spinner';
import {
  FileText, CheckCircle2, AlertTriangle, CalendarDays, Search, Filter,
  ZoomIn, Edit3, Save, X, Eye, Printer, MoreVertical, ShieldAlert, Download, Trash2
} from 'lucide-react';
import { prescriptionService } from '../../services/prescriptionService';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import Modal from '../../components/ui/Modal';

export default function HistoryDashboardPage() {
  const showToast = useAppStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);

  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Verified' | 'Needs Review'
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await prescriptionService.listPrescriptions();
      const list = Array.isArray(response)
        ? response
        : (response?.data || response?.prescriptions || []);

      setPrescriptions(list);
      if (list.length > 0) {
        setSelectedId(list[0].prescription_id);
      }
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to fetch dashboard history.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const selectedRecordRaw = prescriptions.find(p => p.prescription_id === selectedId);

  // Normalize selected record to UI format
  const selectedRecord = (() => {
    if (!selectedRecordRaw) return null;
    const items = selectedRecordRaw.prescription_items || [];
    const isVerified = items.every(i => (i.validation_confidence || 0.5) >= 0.75) && items.length > 0;

    const totalConfidence = items.reduce((sum, i) => sum + (i.validation_confidence || 0.5), 0);
    const avgConfidence = items.length > 0 ? (totalConfidence / items.length) : 0.85;

    const imageObject = selectedRecordRaw.prescription_images || selectedRecordRaw.prescription_image || {};
    const originalUrl = imageObject.original_image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDxQMub5mJyvN_Cs0E38s9xswudAcqO5X1pfkR06mQ9H4cANALe-RShm66y8uZrtbGXITAnGU97gPcBG1HxPMouEpayXk9lS22aks08N7qc7YlAHbY-EvpD3oNl4In5MZ2NyErdZsiluw6XQInHb8yI7WwG9iwPRHJ53GA0uiY7rjQrckh6NpKndXo1NcYuzwLkVt6b9_qycEBm2s1OqplznGTFBvEM-BanNk-3yg9r5V04hqDvsjQmXGhkPhJBH2VpyjGKxj35ek';

    return {
      id: selectedRecordRaw.prescription_id,
      doctor: selectedRecordRaw.doctor_name || 'AI Extraction Pipeline',
      clinic: selectedRecordRaw.medical_notes || 'Handwritten Prescription Document',
      date: selectedRecordRaw.created_at ? new Date(selectedRecordRaw.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date',
      status: isVerified ? 'Verified' : 'Needs Review',
      medicineCount: items.length,
      confidence: Math.round(avgConfidence * 100),
      imageUrl: originalUrl,
      medicines: items.map(i => ({
        name: i.medicine_name || 'Unknown',
        sig: i.frequency || 'As directed',
        dispense: i.dosage || 'As prescribed',
        refills: 0,
        confidence: Math.round((i.validation_confidence || 0.5) * 100),
        status: (i.validation_confidence || 0.5) < 0.6 ? 'warning' : 'normal'
      }))
    };
  })();

  const handleSelectRecord = (id) => {
    setSelectedId(id);
  };

  const handlePrint = async () => {
    if (!selectedId) return;
    setIsExportingPdf(true);
    showToast('Preparing report print job...', 'info');
    try {
      const blob = await prescriptionService.exportPDF(selectedId);
      const url = window.URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      showToast('Print dialog routed.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to load printable PDF document.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePdfDownload = async () => {
    if (!selectedId) return;
    setIsExportingPdf(true);
    showToast('Exporting medical audit PDF report...', 'info');
    try {
      const blob = await prescriptionService.exportPDF(selectedId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_${selectedId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast('Prescription PDF exported successfully.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to download PDF report.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this prescription record?')) return;
    try {
      await prescriptionService.deletePrescription(id);
      showToast('Prescription record deleted successfully.', 'success');
      fetchPrescriptions();
    } catch (error) {
      console.error(error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to delete prescription.');
      showToast(friendlyMsg, 'error');
    }
  };

  // Filters logic applied to list
  const normalizedList = prescriptions.map(item => {
    const items = item.prescription_items || [];
    const isVerified = items.every(i => (i.validation_confidence || 0.5) >= 0.75) && items.length > 0;

    return {
      id: item.prescription_id,
      doctor: item.doctor_name || 'AI Extraction Pipeline',
      clinic: item.medical_notes || 'Handwritten Prescription',
      date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date',
      status: isVerified ? 'Verified' : 'Needs Review',
      medicineCount: items.length
    };
  });

  const filteredRecords = normalizedList.filter(p => {
    const matchesSearch = p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clinic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload Prescription', href: '#upload' },
    { name: 'Prescription History', href: '#history' },
    { name: 'Prescription Recommendations', href: '#recommendations' },
    { name: 'Medicine Search & info', href: '#search' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Reminders & Reports', href: '#reminders' },
    { name: 'Notifications & Alerts', href: '#notifications' },
    { name: 'Prescription Analytics', href: '#prescription-analytics' },
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

            {/* Header section */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-wider text-[10px] mb-4 backdrop-blur-md">
                <span className="material-symbols-outlined text-[14px]">clinical_notes</span>
                <span>Clinical Ingestion Dashboard</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Registry Analysis Workspace</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Manage patient clinical records, review confidence audits, and edit parsed FHIR structures.</p>
            </div>

            {isLoading ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                {/* Left side list: 4 columns */}
                <div className="xl:col-span-4 space-y-4">

                  {/* Search / Filter list card */}
                  <Card variant="glass" className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search records..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl py-1 px-2.5 text-[11px] focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="All">All</option>
                        <option value="Verified">Verified</option>
                        <option value="Needs Review">Needs Review</option>
                      </select>
                    </div>
                  </Card>

                  {/* List item scrollable */}
                  <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredRecords.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectRecord(item.id)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${selectedId === item.id
                          ? 'bg-primary/5 border-primary shadow-md shadow-primary/5'
                          : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.doctor}</h4>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border shrink-0 ${item.status === 'Verified'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            }`}>
                            {item.status === 'Verified' ? 'VERIFIED' : 'REVIEW'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{item.clinic}</p>
                        <div className="flex items-center justify-between mt-3 text-[9px] font-bold text-slate-400">
                          <span>{item.date}</span>
                          <span>{item.medicineCount} Items</span>
                        </div>
                      </div>
                    ))}

                    {filteredRecords.length === 0 && (
                      <div className="py-12 text-center text-slate-450 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <span className="material-symbols-outlined text-[32px] text-slate-350">search_off</span>
                        <p className="text-[11px] font-bold mt-1">No matching clinical records.</p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right side detailed workspace: 8 columns */}
                <div className="xl:col-span-8 space-y-6">
                  {selectedRecord ? (
                    <Card variant="glass" className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative overflow-hidden flex flex-col bg-white dark:bg-slate-900 gap-6">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-emerald-500"></div>

                      {/* Detail Header */}
                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="flex gap-4 items-start text-left">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 flex items-center justify-center text-primary text-xl font-black shadow-sm">
                            {getInitials(selectedRecord.doctor)}
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {selectedRecord.doctor}
                              {selectedRecord.status === 'Verified' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                              )}
                            </h2>
                            <p className="text-xs text-slate-500">{selectedRecord.clinic}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={handlePrint}
                            disabled={isExportingPdf}
                            className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary rounded-xl transition-colors cursor-pointer"
                            title="Print Record"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handlePdfDownload}
                            disabled={isExportingPdf}
                            className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary rounded-xl transition-colors cursor-pointer"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(selectedRecord.id)}
                            className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Metrics audit row */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OCR Confidence</span>
                          <span className="text-lg font-black text-slate-850 dark:text-slate-200 mt-1.5 block">{selectedRecord.confidence}%</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ingested Date</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-350 mt-2 block">{selectedRecord.date}</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registry Status</span>
                          <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedRecord.status === 'Verified'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                            }`}>
                            {selectedRecord.status}
                          </span>
                        </div>
                      </div>

                      {/* Visual & parsed list split */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

                        {/* Image Preview: 4 cols */}
                        <div className="md:col-span-4 flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Original Attachment</span>
                          <div
                            onClick={() => setIsZoomModalOpen(true)}
                            className="flex-1 min-h-[180px] bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden relative cursor-zoom-in group flex items-center justify-center p-1.5"
                          >
                            {selectedRecord.imageUrl.startsWith('data:image/svg') ? (
                              <div
                                dangerouslySetInnerHTML={{ __html: decodeURIComponent(selectedRecord.imageUrl.split(',')[1] || selectedRecord.imageUrl) }}
                                className="w-full h-full object-cover scale-95"
                              />
                            ) : (
                              <img
                                src={selectedRecord.imageUrl}
                                alt="Source Document"
                                className="w-full h-full object-contain filter dark:brightness-90"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Parsed list: 8 cols */}
                        <div className="md:col-span-8 flex flex-col gap-3 text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parsed FHIR Schema Entities</span>
                          <div className="flex flex-col gap-3">
                            {selectedRecord.medicines.map((med, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex justify-between items-center"
                              >
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{med.name}</h4>
                                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{med.dispense} · {med.sig}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded-full ${med.confidence >= 75
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}>
                                    {med.confidence}% Match
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </Card>
                  ) : (
                    <div className="py-24 text-center text-slate-450 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
                      <MaterialIcon name="clinical_notes" size="3xl" className="text-slate-300" />
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">No Clinical Records Found</h3>
                      <p className="text-xs text-slate-450 mt-1">Ingest a handwritten prescription to build your workspace.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        title="Clinical Document Viewer"
      >
        {selectedRecord && (
          <div className="flex flex-col gap-4 font-sans text-left">
            <div className="w-full aspect-[3/4] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-2">
              {selectedRecord.imageUrl.startsWith('data:image/svg') ? (
                <div
                  dangerouslySetInnerHTML={{ __html: decodeURIComponent(selectedRecord.imageUrl.split(',')[1] || selectedRecord.imageUrl) }}
                  className="w-full h-full p-4 object-contain flex items-center justify-center"
                />
              ) : (
                <img
                  src={selectedRecord.imageUrl}
                  alt="Clinical Document Original"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsZoomModalOpen(false)}>
                Close Viewer
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
