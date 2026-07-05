import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import Navbar from '../../components/layout/Navbar';
import SideNavbar from '../../components/layout/SideNavbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';
import {
  FileText, CheckCircle2, AlertTriangle, CalendarDays, Search, Filter,
  ZoomIn, Edit3, Save, X, Eye, Printer, MoreVertical, ShieldAlert
} from 'lucide-react';

const INITIAL_PRESCRIPTIONS = [
  {
    id: 1,
    doctor: 'Dr. Aris Thorne',
    clinic: 'General Hospital',
    date: 'Oct 12, 2023',
    status: 'Verified',
    medicineCount: 3,
    confidence: 98,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYeBFdUL-2L284-QQiDKOhQ2fVnrJFoz0ImwsrsL3b8onK7Y3MVGzx0K_MzMdqO77fgLSTHWGGIsmRD2mf9u_45YXKJKF0tPGTCDNRVcd4sswWjmx4_N3lGT6GsGBJOxAK7DzwuDgue-B_9W9VyPr23KYZsUzZ73lOfygTv-wXYrVrAZc3uWXzqEZQXRbsj7oM3DQpkaIW4qSjlILVCZRLx7GGKKs3PfqqUbj-Es5K9Kp34AjQ1LeaywyIQ4iZlS5joATEQrOx6cc',
    medicines: [
      { name: 'Amoxicillin 500mg', sig: '1 cap PO TID x 7 days', dispense: '21 capsules', refills: 0 },
      { name: 'Lisinopril 10mg', sig: '1 tab PO daily', dispense: '30 tablets', refills: 3 },
      { name: 'Atorvastatin 20mg', sig: '1 tab PO daily at bedtime', dispense: '30 tablets', refills: 2 }
    ]
  },
  {
    id: 2,
    doctor: 'Dr. Elena Rostova',
    clinic: 'City Clinic Care',
    date: 'Oct 10, 2023',
    status: 'Pending',
    medicineCount: 1,
    confidence: 84,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYeBFdUL-2L284-QQiDKOhQ2fVnrJFoz0ImwsrsL3b8onK7Y3MVGzx0K_MzMdqO77fgLSTHWGGIsmRD2mf9u_45YXKJKF0tPGTCDNRVcd4sswWjmx4_N3lGT6GsGBJOxAK7DzwuDgue-B_9W9VyPr23KYZsUzZ73lOfygTv-wXYrVrAZc3uWXzqEZQXRbsj7oM3DQpkaIW4qSjlILVCZRLx7GGKKs3PfqqUbj-Es5K9Kp34AjQ1LeaywyIQ4iZlS5joATEQrOx6cc',
    medicines: [
      { name: 'Metformin 850mg', sig: '1 tab PO BID with meals', dispense: '60 tablets', refills: 1 }
    ]
  },
  {
    id: 3,
    doctor: 'Dr. Marcus Vance',
    clinic: 'St. Jude\'s Medical',
    date: 'Oct 08, 2023',
    status: 'Shared',
    medicineCount: 4,
    confidence: 95,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYeBFdUL-2L284-QQiDKOhQ2fVnrJFoz0ImwsrsL3b8onK7Y3MVGzx0K_MzMdqO77fgLSTHWGGIsmRD2mf9u_45YXKJKF0tPGTCDNRVcd4sswWjmx4_N3lGT6GsGBJOxAK7DzwuDgue-B_9W9VyPr23KYZsUzZ73lOfygTv-wXYrVrAZc3uWXzqEZQXRbsj7oM3DQpkaIW4qSjlILVCZRLx7GGKKs3PfqqUbj-Es5K9Kp34AjQ1LeaywyIQ4iZlS5joATEQrOx6cc',
    medicines: [
      { name: 'Ibuprofen 400mg', sig: '1 tab PO q6h prn pain', dispense: '30 tablets', refills: 0 },
      { name: 'Omeprazole 20mg', sig: '1 cap PO daily 30m before breakfast', dispense: '30 capsules', refills: 1 },
      { name: 'Vitamin D3 5000 IU', sig: '1 cap PO daily', dispense: '90 capsules', refills: 5 },
      { name: 'Sertraline 50mg', sig: '1 tab PO daily', dispense: '30 tablets', refills: 3 }
    ]
  }
];

export default function HistoryDashboardPage() {
  const showToast = useAppStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);

  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [selectedId, setSelectedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Verified' | 'Pending' | 'Shared'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Editing form states
  const [editForm, setEditForm] = useState(null);

  const selectedRecord = prescriptions.find(p => p.id === selectedId) || prescriptions[0];

  const handleSelectRecord = (id) => {
    setSelectedId(id);
  };

  const handleOpenEdit = () => {
    setEditForm({ ...selectedRecord });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPrescriptions(prev => prev.map(p => p.id === editForm.id ? { ...editForm, medicineCount: editForm.medicines.length } : p));
    setIsEditModalOpen(false);
    showToast('Prescription record updated successfully!', 'success');
  };

  const handleMedicineChange = (idx, field, val) => {
    const updatedMedicines = [...editForm.medicines];
    updatedMedicines[idx] = { ...updatedMedicines[idx], [field]: val };
    setEditForm({ ...editForm, medicines: updatedMedicines });
  };

  const handlePrint = () => {
    showToast('Simulating HL7 FHIR print routing...', 'info');
  };

  // Filters logic
  const filteredRecords = prescriptions.filter(p => {
    const matchesSearch = p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.medicines.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          {/* <SideNavbar activeRoute="#history-dashboard" /> */}

          {/* Main workspace */}
          <div className="flex-1 w-full space-y-8 text-left">

            {/* Header section */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-md text-label-md mb-4 backdrop-blur-md">
                <MaterialIcon name="insights" size="xs" className="mr-1 text-primary" />
                <span>Prescription History Dashboard</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Visualize Your <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Prescription History</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Comprehensive AI-driven analysis of upload trends, verification confidence, and historical records.
              </p>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <Card variant="glass" className="p-5 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Total Prescriptions</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">245</div>
                <div className="h-6 mt-2 flex items-end">
                  <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d="M0,20 L10,15 L20,18 L30,10 L40,12 L50,5 L60,8 L70,2 L80,6 L90,1 L100,5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </Card>

              {/* Stat 2 */}
              <Card variant="glass" className="p-5 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Verified Records</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">198</div>
                <div className="h-6 mt-2 flex items-end">
                  <svg className="w-full h-full text-emerald-500" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d="M0,20 L15,18 L30,15 L45,10 L60,8 L75,4 L90,2 L100,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </Card>

              {/* Stat 3 */}
              <Card variant="glass" className="p-5 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Needs Review</span>
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-rose-600 dark:text-rose-500 mt-1">12</div>
                <div className="h-6 mt-2 flex items-end">
                  <svg className="w-full h-full text-rose-500" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d="M0,10 L20,12 L40,8 L60,15 L80,10 L100,12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </Card>

              {/* Stat 4 */}
              <Card variant="glass" className="p-5 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">This Month</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-350">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1">32</div>
                <div className="h-6 mt-2 flex items-end">
                  <svg className="w-full h-full text-slate-500" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d="M0,15 L25,10 L50,12 L75,5 L100,2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
              </Card>
            </div>

            {/* Layout Grid: Left Content (Trend Chart & History Cards) & Right sticky Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* Left Side (8 cols) */}
              <div className="lg:col-span-8 space-y-6">

                {/* Upload Activity trends Card */}
                <Card variant="glass" className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white">Upload Activity Trends</h3>
                    <button className="text-xs font-bold text-primary hover:underline" onClick={() => showToast('Detailed analytics report downloading...', 'info')}>
                      View Detailed Report
                    </button>
                  </div>

                  {/* SVG line chart */}
                  <div className="relative bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 h-64 flex flex-col justify-between">
                    <div className="absolute inset-0 grid-bg opacity-30 z-0 pointer-events-none"></div>
                    <div className="flex-1 w-full relative z-10 flex items-end">
                      <svg className="w-full h-4/5 text-primary overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
                        <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
                        <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />

                        {/* Chart Path */}
                        <path
                          d="M 0 90 Q 50 70 100 80 T 200 40 T 300 50 T 400 20 T 500 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {/* Interactive Dot */}
                        <circle cx="400" cy="20" r="5" className="fill-primary stroke-white dark:stroke-slate-950 stroke-2 cursor-pointer hover:r-7 transition-all" />
                      </svg>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase px-2 z-10">
                      <span>30 Days ago</span>
                      <span>15 Days ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                </Card>

                {/* Search & Filter Bar */}
                <Card variant="glass" className="p-3 flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 focus-within:border-primary/50 transition-colors w-full">
                    <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by patient, doctor, or medication..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs w-full placeholder:text-slate-400 text-slate-800 dark:text-white p-0 focus:ring-0"
                    />
                  </div>

                  <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

                  <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                    {['All', 'Verified', 'Pending', 'Shared'].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${statusFilter === status
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* History Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRecords.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-xs text-slate-400">
                      No matching records found.
                    </div>
                  ) : (
                    filteredRecords.map(item => {
                      const isActive = item.id === selectedId;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectRecord(item.id)}
                          className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 flex gap-4 transition-all cursor-pointer group shadow-sm hover:shadow-md ${isActive
                              ? 'border-primary shadow-[0_4px_20px_rgba(0,107,251,0.08)] ring-1 ring-primary/20'
                              : 'border-slate-200 dark:border-slate-850'
                            }`}
                        >
                          <div className="w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-950 overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-800/80 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-slate-200/10 opacity-60"></div>
                            <FileText className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 className={`text-sm font-bold truncate group-hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-slate-800 dark:text-white'
                                  }`}>
                                  {item.doctor}
                                </h4>
                                <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.status === 'Verified'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                                    : item.status === 'Pending'
                                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                      : 'bg-primary/10 text-primary'
                                  }`}>
                                  {item.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{item.clinic}</p>
                            </div>

                            <div className="flex justify-between items-end text-[10px] text-slate-400 font-bold uppercase pt-2">
                              <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {item.date}</span>
                              <span className="flex items-center gap-1"><MaterialIcon name="medication" size="xs" /> {item.medicineCount} Meds</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Side Sticky Preview Drawer (4 cols) */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-8rem)] shadow-xl relative z-10">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
                  <h3 className="text-xs font-black text-slate-850 dark:text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" /> Record Preview
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={handlePrint}
                      className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                      title="Print record"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Drawer Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Image Document Scanner Card */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 relative group">
                    <img
                      alt="Prescription Scan preview"
                      className="w-full h-44 object-cover"
                      src={selectedRecord.imageUrl}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => setIsZoomModalOpen(true)}
                        className="px-4 py-2 bg-white text-primary font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>View Full Size</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Extraction Confidence percentage */}
                  <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/30 dark:border-indigo-900/30 flex items-start gap-3">
                    <span className="material-symbols-outlined text-tertiary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">AI Extraction Confidence</span>
                        <span className="text-xs font-black text-tertiary">{selectedRecord.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-850 rounded-full h-1.5 mt-2">
                        <div className="bg-tertiary h-1.5 rounded-full transition-all duration-500" style={{ width: `${selectedRecord.confidence}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Extracted medicines list */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Extracted Information</h4>
                    <div className="space-y-3">
                      {selectedRecord.medicines.map((med, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/30 hover:border-primary/45 transition-colors">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <span className="text-xs font-black text-slate-800 dark:text-white leading-tight">{med.name}</span>
                            <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }} title="Verified high confidence">check_circle</span>
                          </div>
                          <div className="text-[11px] text-slate-500 space-y-1 font-medium leading-relaxed">
                            <p><span className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Sig:</span> {med.sig}</p>
                            <p><span className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Dispense:</span> {med.dispense}</p>
                            <p><span className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Refills:</span> {med.refills}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleOpenEdit}
                    className="w-full border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold py-2.5 rounded-xl text-xs flex justify-center items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Record</span>
                  </Button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Edit Record Modal */}
      <AnimatePresence>
        {isEditModalOpen && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-black text-slate-855 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" /> Edit Prescription Record
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-655"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Prescribing Physician</label>
                    <input
                      type="text"
                      value={editForm.doctor}
                      onChange={(e) => setEditForm({ ...editForm, doctor: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Medical Facility</label>
                    <input
                      type="text"
                      value={editForm.clinic}
                      onChange={(e) => setEditForm({ ...editForm, clinic: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Date of Issue</label>
                    <input
                      type="text"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Verification Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none font-semibold text-slate-800 dark:text-white"
                    >
                      <option>Verified</option>
                      <option>Pending</option>
                      <option>Shared</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Medicines Configuration</h4>

                  {editForm.medicines.map((med, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">Medication Name</label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none text-slate-800 dark:text-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-450 uppercase mb-1">Sig (Instructions)</label>
                          <input
                            type="text"
                            value={med.sig}
                            onChange={(e) => handleMedicineChange(idx, 'sig', e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none text-slate-800 dark:text-white font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1">Dispense Count</label>
                          <input
                            type="text"
                            value={med.dispense}
                            onChange={(e) => handleMedicineChange(idx, 'dispense', e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none text-slate-800 dark:text-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-455 uppercase mb-1">Refills Allowed</label>
                          <input
                            type="number"
                            value={med.refills}
                            onChange={(e) => handleMedicineChange(idx, 'refills', parseInt(e.target.value) || 0)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none text-slate-800 dark:text-white font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="border-slate-250 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850 py-2.5 px-5 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-primary hover:bg-primary-container text-white py-2.5 px-6 rounded-xl font-bold text-xs flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Zoom Modal */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-primary" /> {selectedRecord.doctor} — Prescription Scan
                </h3>
                <button onClick={() => setIsZoomModalOpen(false)} className="text-slate-450 hover:text-slate-655"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <img
                  alt="Zoomed Prescription Scan Document"
                  className="max-h-[70vh] w-auto object-contain rounded-lg border shadow-lg"
                  src={selectedRecord.imageUrl}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
