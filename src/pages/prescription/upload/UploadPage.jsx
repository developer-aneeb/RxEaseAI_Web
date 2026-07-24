import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  Lightbulb, Play,
  RefreshCw,
  Upload
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import CameraView from './CameraView';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import MaterialIcon from '../../../components/ui/MaterialIcon';
import { prescriptionService } from '../../../services/prescriptionService';
import { useAppStore } from '../../../store/useAppStore';
import { usePrescriptionStore } from '../../../store/usePrescriptionStore';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';

// Mock SVG Prescription generator helper
const createMockSvg = (patient, drug, dosage, qty, sig, docName) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="15" y="15" width="370" height="470" rx="10" fill="none" stroke="%233b82f6" stroke-width="2" stroke-dasharray="5 5"/><rect x="20" y="20" width="360" height="460" rx="8" fill="none" stroke="%23cbd5e1" stroke-width="2"/><text x="40" y="60" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">APEX HEALTH CLINIC</text><text x="40" y="80" font-family="sans-serif" font-size="11" fill="%2364748b">786 Medical Heights, Suite 100</text><line x1="40" y1="105" x2="360" y2="105" stroke="%23cbd5e1" stroke-width="1.5"/><text x="40" y="130" font-family="sans-serif" font-size="12" font-weight="semibold" fill="%23334155">Patient: ${patient}</text><text x="40" y="150" font-family="sans-serif" font-size="12" fill="%23334155">Date: 2026-07-04</text><text x="40" y="210" font-family="sans-serif" font-size="32" font-weight="bold" fill="%230055c9">Rx</text><text x="40" y="255" font-family="sans-serif" font-size="18" font-weight="bold" fill="%231e293b">${drug}</text><text x="40" y="280" font-family="sans-serif" font-size="13" fill="%23475569">Dispense: ${qty}</text><text x="40" y="305" font-family="sans-serif" font-size="13" fill="%23475569">Sig: ${sig}</text><line x1="40" y1="380" x2="360" y2="380" stroke="%23cbd5e1" stroke-width="1"/><text x="240" y="420" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23475569">${docName}</text><line x1="220" y1="405" x2="340" y2="405" stroke="%2394a3b8" stroke-width="1"/><text x="250" y="435" font-family="sans-serif" font-size="9" fill="%2394a3b8">Authorized Signature</text></svg>`;
};

export default function UploadPage() {
  const {
    currentPrescription,
    uploadProgress,
    ocrState,
    aiResult,
    setCurrentPrescription,
    setUploadProgress,
    setOcrState,
    setAiResult,
    clearPrescription,
    resetStore
  } = usePrescriptionStore();

  const showToast = useAppStore((state) => state.showToast);

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera'
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const fileInputRef = useRef(null);
  const selectedFileRef = useRef(null); // Keep actual File object for upload

  useEffect(() => {
    // Reset error on mount
    setAnalysisError(null);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Please upload a JPEG or PNG image of your prescription.', 'error');
      return;
    }

    if (file.size > 500 * 1024) {
      showToast('File is too large. Maximum 500KB allowed.', 'error');
      return;
    }

    // Store the actual File object for backend upload
    selectedFileRef.current = file;
    setAnalysisError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      // Use the data URL for preview only
      setCurrentPrescription(e.target.result);
      setSelectedSampleId(null);
      showToast('File selected successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleSampleSelect = (sample) => {
    setSelectedSampleId(sample.id);
    setCurrentPrescription(sample.svg);
    setAiResult(sample);
    showToast(`Loaded sample prescription: ${sample.patient}`, 'success');
  };

  const startAnalysis = async () => {
    // For real uploads, we need the File object. For mock samples, use sample data.
    const fileToUpload = selectedFileRef.current;
    const isRealUpload = !!fileToUpload;
    const isSampleUpload = !!selectedSampleId && !!aiResult;

    if (!currentPrescription) {
      showToast('Please upload a file or select a sample first.', 'warning');
      return;
    }

    // If it's a sample, navigate directly to result with mock data
    if (isSampleUpload && !isRealUpload) {
      setOcrState('uploading');
      setUploadProgress(0);
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            setOcrState('processing');
            setTimeout(() => {
              setOcrState('success');
              showToast('Sample prescription loaded!', 'success');
              window.location.hash = '#result';
            }, 2000);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return;
    }

    // Real file upload to backend
    if (!isRealUpload) {
      showToast('Please upload a prescription image file.', 'warning');
      return;
    }

    setOcrState('uploading');
    setUploadProgress(0);
    setAnalysisError(null);

    // Animate upload progress (cosmetic — actual upload happens in parallel)
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 90) {
        progress = 90; // Hold at 90% until real response arrives
        clearInterval(progressInterval);
      }
      setUploadProgress(Math.min(Math.round(progress), 90));
    }, 200);

    try {
      const result = await prescriptionService.uploadAndAnalyze(fileToUpload);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setOcrState('processing');

      // Store the real backend result
      setAiResult(result);

      // Brief processing animation then navigate
      setTimeout(() => {
        setOcrState('success');
        showToast('Prescription analyzed successfully!', 'success');
        window.location.hash = '#result';
      }, 1500);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setOcrState('idle');

      const status = error.response?.status;
      const errorData = error.response?.data;

      if (status === 422 && errorData?.allowed === false) {
        // Gate rejection — not a valid prescription
        const msg = errorData?.message || errorData?.gate?.message || 'This image does not appear to be a valid handwritten prescription.';
        setAnalysisError(msg);
        showToast(msg, 'error');
      } else if (status === 503) {
        // AI service unavailable
        const msg = 'The AI analysis service is temporarily unavailable. Please try again in a few minutes.';
        setAnalysisError(msg);
        showToast(msg, 'error');
      } else {
        const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to analyze prescription. Please try again.');
        setAnalysisError(friendlyMsg);
        showToast(friendlyMsg, 'error');
      }
    }
  };

  const uploadLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Recommendations', href: '#recommendations' },
    { name: 'Prescription Analytics', href: '#prescription-analytics' },
  ];

  // Render sub-views depending on state
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={uploadLinks} />

      {/* Grid background & ambient glow */}
      <div className="absolute inset-0 grid-bg z-0 pointer-events-none opacity-50 dark:opacity-30"></div>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-tertiary/10 rounded-full blur-[120px] mix-blend-multiply opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full font-geist">

        {/* Back Link */}
        <div className="mb-6 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetStore();
              window.location.hash = '#home';
            }}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {/* STATE 1: IDLE UPLOAD INTERFACE */}
          {ocrState === 'idle' && (
            <motion.div
              key="idle-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
            >

              {/* Left Column: Storytelling, Metrics, Pipeline (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="text-left">
                  <Badge
                    variant="neutral"
                    className="bg-primary/10 border border-primary/20 text-primary dark:text-primary-fixed-dim uppercase tracking-wider text-xs px-3 py-1.5 mb-6 inline-flex items-center gap-2 cursor-default font-semibold rounded-full"
                  >
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </div>
                    <span>AI-Powered Ingestion Pipeline</span>
                  </Badge>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                    Ingest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Prescriptions</span> in Real-Time
                  </h1>

                  <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed mb-6">
                    Our AI models ingest handwritten clinical notes and doctor prescriptions.
                    Instantly extract dosage directives, match patient demographics, and safety-audit drug interactions.
                  </p>
                </div>

                {/* Bento metrics cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card variant="glass" className="p-4 rounded-2xl flex items-start gap-3 border border-slate-205 dark:border-slate-800 text-left">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="bolt" size="sm" style={{ fontVariationSettings: "'FILL' 1" }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">&lt; 30 Secs</div>
                      <div className="text-[11px] text-slate-550 font-medium mt-0.5">Analysis Speed</div>
                    </div>
                  </Card>

                  <Card variant="glass" className="p-4 rounded-2xl flex items-start gap-3 border border-slate-205 dark:border-slate-800 text-left">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="target" size="sm" style={{ fontVariationSettings: "'FILL' 1" }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">74%</div>
                      <div className="text-[11px] text-slate-550 font-medium mt-0.5">Model Accuracy</div>
                    </div>
                  </Card>

                  <Card variant="glass" className="p-4 rounded-2xl flex items-start gap-3 col-span-2 border border-slate-205 dark:border-slate-800 text-left">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-emerald-500 shrink-0">
                      <MaterialIcon name="lock" size="sm" style={{ fontVariationSettings: "'FILL' 1" }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">HIPAA Compliant</div>
                      <div className="text-xs text-slate-500 mt-0.5">End-to-end client-side encryption for clinical uploads</div>
                    </div>
                  </Card>
                </div>

                {/* Pipeline visual */}
                <Card variant="glass" className="p-5 rounded-2xl border border-slate-205 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 relative overflow-hidden text-left">
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-6">Intelligence Ingestion Pipeline</h3>
                  <div className="flex flex-col gap-6 relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-indigo-500 to-slate-200 dark:to-slate-800 z-0"></div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                        <MaterialIcon name="upload_file" size="xs" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Prescription Ingestion</span>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-md relative">
                        <div className="absolute inset-0 rounded-full border border-indigo-500 animate-pulse-ring"></div>
                        <MaterialIcon name="psychology" size="xs" />
                      </div>
                      <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400">OCR & NLP Diagnostics Extraction</span>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                        <MaterialIcon name="verified" size="xs" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Dosage Audits & FHIR Structuring</span>
                    </div>
                  </div>
                </Card>

              </div>

              {/* Right Column: Ingestion Controls & Interface (7 Cols) */}
              <div className="lg:col-span-7 h-full">
                <Card variant="glass" className="rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-2xl relative flex flex-col h-full bg-white dark:bg-slate-900">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-tertiary"></div>

                  {/* Custom Tab Selectors */}
                  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-xl mb-8 self-start border border-slate-200/50 dark:border-slate-800/55">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'upload'
                        ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm'
                        : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                      Upload File
                    </button>
                    <button
                      onClick={() => setActiveTab('camera')}
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'camera'
                        ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm'
                        : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                      Capture Camera
                    </button>

                  </div>

                  {/* TAB 1: FILE UPLOAD ZONE */}
                  {activeTab === 'upload' && (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={triggerBrowse}
                      className="flex-1 min-h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 hover:bg-primary/5 dark:hover:bg-primary/5/10 flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        className="hidden"
                      />

                      {currentPrescription ? (
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-32 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md mb-4 bg-white dark:bg-slate-950 relative">
                            {currentPrescription.startsWith('data:image/svg+xml') ? (
                              <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(currentPrescription.split(',')[1]) }} className="w-full h-full object-cover scale-95" />
                            ) : (
                              <img src={currentPrescription} alt="prescription thumbnail" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Prescription Loaded</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">Click to replace file</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-8 h-8" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Drag & drop your prescription here</h3>
                          <p className="text-xs text-slate-500 mb-6">or click to browse from device</p>
                          <Button variant="outline" size="sm" icon={Upload} className="pointer-events-none">
                            Browse Files
                          </Button>
                          <p className="text-[10px] text-slate-450 mt-6">Supported formats: JPG, PNG, PDF (Max 500KB)</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* TAB 2: CAMERA VIEW CAPTURE */}
                  {activeTab === 'camera' && (
                    <CameraView
                      onCapture={(file, dataUrl) => {
                        selectedFileRef.current = file;
                        setCurrentPrescription(dataUrl);
                        setSelectedSampleId(null);
                        setAiResult(null);
                      }}
                      onRetake={() => {
                        setCurrentPrescription(null);
                        selectedFileRef.current = null;
                      }}
                    />
                  )}



                  {/* Helper Tip */}
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-start gap-3.5 text-left font-sans">
                    <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">For Best OCR Accuracy</h4>
                      <p className="text-[11px] text-slate-550 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Ensure the paper prescription document is well-lit, flattened without folds, and the medical notations are clearly in focus.
                      </p>
                    </div>
                  </div>

                  {/* Analysis Trigger Action */}
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/85 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={startAnalysis}
                      disabled={!currentPrescription}
                      className="w-full md:w-auto px-8 py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MaterialIcon name="psychology" size="sm" />
                      <span>Analyze Prescription</span>
                    </Button>
                  </div>

                </Card>
              </div>

            </motion.div>
          )}

          {/* STATE 2: UPLOADING PROGRESS BAR */}
          {ocrState === 'uploading' && (
            <motion.div
              key="uploading-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto py-16"
            >
              <Card variant="glass" className="p-8 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 animate-bounce" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ingesting File</h2>
                <p className="text-xs text-slate-500 mb-8">Encrypting patient metadata and loading data nodes...</p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden mb-3 border border-slate-200/50 dark:border-slate-800">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                  <span>PROGRESS</span>
                  <span className="font-bold text-primary">{uploadProgress}%</span>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STATE 3: OCR SCANNERS/LASERS */}
          {ocrState === 'processing' && (
            <motion.div
              key="processing-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg mx-auto py-8"
            >
              <Card variant="glass" className="p-6 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden relative">

                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Diagnostics Extraction</h2>
                  <p className="text-xs text-indigo-650 dark:text-indigo-400 font-mono mt-1">RUNNING CLINICAL OCR & SEGMENTATION...</p>
                </div>

                {/* Scanning HUD Screen Container */}
                <div className="w-full aspect-[4/5] max-w-[340px] mx-auto bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-inner flex items-center justify-center p-4">

                  {/* Laser & Overlay elements */}
                  <div className="laser-line animate-scan"></div>
                  <div className="scan-overlay animate-scan-fade"></div>

                  {/* Loaded Image Content */}
                  <div className="w-full h-full relative z-0 flex items-center justify-center">
                    {currentPrescription.startsWith('data:image/svg+xml') ? (
                      <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(currentPrescription.split(',')[1]) }} className="w-full h-full object-cover scale-95" />
                    ) : (
                      <img src={currentPrescription} alt="scanning prescription" className="w-full h-full object-contain filter grayscale" />
                    )}
                  </div>

                  {/* Digital HUD box corners */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Processing YOLO Vision Segment Nodes</span>
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div >
  );
}
