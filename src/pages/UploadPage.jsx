import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Camera, FileText, CheckCircle2, AlertTriangle, 
  ArrowLeft, RefreshCw, Copy, Check, Lightbulb, Play, Eye
} from 'lucide-react';
import { usePrescriptionStore } from '../store/usePrescriptionStore';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import MaterialIcon from '../components/ui/MaterialIcon';
import Navbar from '../components/layout/Navbar';

// Mock SVG Prescription generator helper
const createMockSvg = (patient, drug, dosage, qty, sig, docName) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="15" y="15" width="370" height="470" rx="10" fill="none" stroke="%233b82f6" stroke-width="2" stroke-dasharray="5 5"/><rect x="20" y="20" width="360" height="460" rx="8" fill="none" stroke="%23cbd5e1" stroke-width="2"/><text x="40" y="60" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230f172a">APEX HEALTH CLINIC</text><text x="40" y="80" font-family="sans-serif" font-size="11" fill="%2364748b">786 Medical Heights, Suite 100</text><line x1="40" y1="105" x2="360" y2="105" stroke="%23cbd5e1" stroke-width="1.5"/><text x="40" y="130" font-family="sans-serif" font-size="12" font-weight="semibold" fill="%23334155">Patient: ${patient}</text><text x="40" y="150" font-family="sans-serif" font-size="12" fill="%23334155">Date: 2026-07-04</text><text x="40" y="210" font-family="sans-serif" font-size="32" font-weight="bold" fill="%230055c9">Rx</text><text x="40" y="255" font-family="sans-serif" font-size="18" font-weight="bold" fill="%231e293b">${drug}</text><text x="40" y="280" font-family="sans-serif" font-size="13" fill="%23475569">Dispense: ${qty}</text><text x="40" y="305" font-family="sans-serif" font-size="13" fill="%23475569">Sig: ${sig}</text><line x1="40" y1="380" x2="360" y2="380" stroke="%23cbd5e1" stroke-width="1"/><text x="240" y="420" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23475569">${docName}</text><line x1="220" y1="405" x2="340" y2="405" stroke="%2394a3b8" stroke-width="1"/><text x="250" y="435" font-family="sans-serif" font-size="9" fill="%2394a3b8">Authorized Signature</text></svg>`;
};

const MOCK_SAMPLES = [
  {
    id: 'sample-1',
    patient: 'Amina Khan',
    drug: 'Amoxicillin 500mg',
    qty: '21 Capsules',
    sig: 'Take 1 capsule three times daily for 7 days',
    docName: 'Dr. Sterling',
    type: 'Antibiotic',
    confidence: '99.2%',
    accuracy: '100%',
    verification: 'High',
    status: 'Verified',
    svg: createMockSvg('Amina Khan', 'Amoxicillin 500mg', '500mg', '21 Capsules', 'Take 1 capsule three times daily for 7 days', 'Dr. Sterling'),
    medications: [
      {
        name: 'Amoxicillin 500mg',
        type: 'Antibiotic • Capsule',
        match: '99%',
        dosage: '1 Capsule',
        frequency: 'Twice Daily',
        duration: '5 Days',
        instructions: 'After Meals',
        icon: 'medication'
      },
      {
        name: 'Paracetamol 650mg',
        type: 'Analgesic • Tablet',
        match: '98%',
        dosage: '1 Tablet',
        frequency: 'As Needed',
        duration: '3 Days',
        instructions: 'Fever > 100°F',
        icon: 'pill'
      }
    ],
    bento: {
      generic: {
        title: 'Generic Alternative Available',
        desc: 'A structurally identical generic for Amoxicillin is available locally.',
        savings: 'Save Rs. 450'
      },
      safety: {
        status: 'passed',
        rules: [
          'No adverse drug interactions',
          'Dosages within safe limits',
          'Clinical checks fully cleared'
        ]
      }
    },
    fhir: {
      resourceType: "MedicationRequest",
      id: "rx-9082",
      status: "active",
      intent: "order",
      medicationCodeableConcept: {
        coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "308182", display: "Amoxicillin 500mg Oral Capsule" }]
      },
      subject: { reference: "Patient/amina-khan", display: "Amina Khan" },
      dosageInstruction: [{
        text: "Take 1 capsule three times daily for 7 days",
        timing: { repeat: { frequency: 3, period: 1, periodUnit: "d" } },
        doseAndRate: [{ doseQuantity: { value: 1, unit: "capsule" } }]
      }],
      dispenseRequest: { quantity: { value: 21, unit: "capsule" } }
    }
  },
  {
    id: 'sample-2',
    patient: 'Imran Malik',
    drug: 'Metformin 1000mg',
    qty: '60 Tablets',
    sig: 'Take 1 tablet twice daily with meals',
    docName: 'Dr. Sarah Smith',
    type: 'Anti-Diabetic',
    confidence: '99.5%',
    accuracy: '100%',
    verification: 'High',
    status: 'Verified',
    svg: createMockSvg('Imran Malik', 'Metformin 1000mg', '1000mg', '60 Tablets', 'Take 1 tablet twice daily with meals', 'Dr. Sarah Smith'),
    medications: [
      {
        name: 'Metformin 1000mg',
        type: 'Anti-Diabetic • Tablet',
        match: '99%',
        dosage: '1 Tablet',
        frequency: 'Twice Daily',
        duration: '60 Days',
        instructions: 'With Meals',
        icon: 'medication'
      },
      {
        name: 'Glipizide 5mg',
        type: 'Anti-Diabetic • Tablet',
        match: '96%',
        dosage: '1 Tablet',
        frequency: 'Once Daily',
        duration: '30 Days',
        instructions: 'Before Breakfast',
        icon: 'pill'
      }
    ],
    bento: {
      generic: {
        title: 'Generic Alternative Available',
        desc: 'A structurally identical generic for Metformin is available locally.',
        savings: 'Save Rs. 180'
      },
      safety: {
        status: 'passed',
        rules: [
          'No adverse drug interactions',
          'Dosages within safe limits',
          'Clinical checks fully cleared'
        ]
      }
    },
    fhir: {
      resourceType: "MedicationRequest",
      id: "rx-9081",
      status: "active",
      intent: "order",
      medicationCodeableConcept: {
        coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "860975", display: "Metformin hydrochloride 1000mg Oral Tablet" }]
      },
      subject: { reference: "Patient/imran-malik", display: "Imran Malik" },
      dosageInstruction: [{
        text: "Take 1 tablet twice daily with meals",
        timing: { repeat: { frequency: 2, period: 1, periodUnit: "d" } },
        doseAndRate: [{ doseQuantity: { value: 1, unit: "tablet" } }]
      }],
      dispenseRequest: { quantity: { value: 60, unit: "tablet" } }
    }
  },
  {
    id: 'sample-3',
    patient: 'Bilal Ahmed',
    drug: 'Ibuprofen 400mg',
    qty: '30 Tablets',
    sig: 'Take 1 tablet every 6 hours as needed for severe pain',
    docName: 'Dr. Sterling',
    type: 'NSAID',
    confidence: '97.5%',
    accuracy: '98%',
    verification: 'Flagged',
    status: 'Flagged (Dosage)',
    svg: createMockSvg('Bilal Ahmed', 'Ibuprofen 400mg', '400mg', '30 Tablets', 'Take 1 tablet every 6 hours as needed for severe pain', 'Dr. Sterling'),
    medications: [
      {
        name: 'Ibuprofen 400mg',
        type: 'NSAID • Tablet',
        match: '98%',
        dosage: '1 Tablet',
        frequency: 'Every 6 Hours',
        duration: '3 Days',
        instructions: 'As Needed for Pain',
        icon: 'medication'
      },
      {
        name: 'Omeprazole 20mg',
        type: 'Proton Pump Inhibitor • Capsule',
        match: '95%',
        dosage: '1 Capsule',
        frequency: 'Once Daily',
        duration: '7 Days',
        instructions: '30m Before Breakfast',
        icon: 'pill'
      }
    ],
    bento: {
      generic: {
        title: 'Generic Alternative Available',
        desc: 'A structurally identical generic for Ibuprofen is available locally.',
        savings: 'Save Rs. 50'
      },
      safety: {
        status: 'flagged',
        rules: [
          'No adverse drug interactions detected',
          'Flagged: High daily cumulative dosage',
          'Verify patient age and renal clearance'
        ]
      }
    },
    fhir: {
      resourceType: "MedicationRequest",
      id: "rx-9079",
      status: "active",
      intent: "order",
      medicationCodeableConcept: {
        coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "197821", display: "Ibuprofen 400mg Oral Tablet" }]
      },
      subject: { reference: "Patient/bilal-ahmed", display: "Bilal Ahmed" },
      dosageInstruction: [{
        text: "Take 1 tablet every 6 hours as needed for pain",
        timing: { repeat: { frequency: 4, period: 1, periodUnit: "d" } },
        doseAndRate: [{ doseQuantity: { value: 1, unit: "tablet" } }]
      }],
      dispenseRequest: { quantity: { value: 30, unit: "tablet" } }
    }
  }
];

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
  
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera' | 'sample'
  const [cameraState, setCameraState] = useState('idle'); // 'idle' | 'capturing' | 'captured'
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeJsonTab, setActiveJsonTab] = useState(false); // view raw FHIR JSON
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Reset store on mount
    resetStore();
  }, [resetStore]);

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
    if (!file.type.match('image.*') && file.type !== 'application/pdf') {
      showToast('Unsupported file type. Please upload an image or PDF.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('File is too large. Max 10MB allowed.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // Use the read contents as our current prescription
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

  const startCameraCapture = () => {
    setCameraState('capturing');
    setTimeout(() => {
      // Simulate camera snapshotting a random sample
      const randomSample = MOCK_SAMPLES[Math.floor(Math.random() * MOCK_SAMPLES.length)];
      setCurrentPrescription(randomSample.svg);
      setAiResult(randomSample);
      setCameraState('captured');
      showToast('Prescription snapshot captured!', 'success');
    }, 2000);
  };

  const startAnalysis = () => {
    if (!currentPrescription) {
      showToast('Please upload a file or select a sample first.', 'warning');
      return;
    }

    // If it was a mock uploaded file without pre-configured AI result, attach a default one
    if (!aiResult) {
      setAiResult(MOCK_SAMPLES[0]); // default to sample 1 info
    }

    setOcrState('uploading');
    setUploadProgress(0);

    // 1. Simulate Upload Progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          // Transition to processing
          setOcrState('processing');
          simulateOcrProcessing();
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const simulateOcrProcessing = () => {
    // 2. Simulate OCR analysis delay
    setTimeout(() => {
      setOcrState('success');
      showToast('Prescription analyzed successfully!', 'success');
    }, 3500);
  };

  const copyFhirJson = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(JSON.stringify(aiResult.fhir, null, 2));
    setCopied(true);
    showToast('FHIR JSON copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = () => {
    showToast('Prescription approved and logged in clinical registry.', 'success');
    // Clear and navigate home
    resetStore();
    window.location.hash = '#home';
  };

  // Render sub-views depending on state
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      
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
                      <div className="text-lg font-bold text-slate-900 dark:text-white">&lt; 2s</div>
                      <div className="text-[11px] text-slate-550 font-medium mt-0.5">Analysis Speed</div>
                    </div>
                  </Card>

                  <Card variant="glass" className="p-4 rounded-2xl flex items-start gap-3 border border-slate-205 dark:border-slate-800 text-left">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-primary shrink-0">
                      <MaterialIcon name="target" size="sm" style={{ fontVariationSettings: "'FILL' 1" }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">99.8%</div>
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
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'upload' 
                          ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm' 
                          : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Upload File
                    </button>
                    <button 
                      onClick={() => setActiveTab('camera')} 
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'camera' 
                          ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm' 
                          : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Capture Camera
                    </button>
                    <button 
                      onClick={() => setActiveTab('sample')} 
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'sample' 
                          ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm' 
                          : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      Select Sample
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
                          <p className="text-[10px] text-slate-450 mt-6">Supported formats: JPG, PNG, PDF (Max 10MB)</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* TAB 2: CAMERA VIEW CAPTURE */}
                  {activeTab === 'camera' && (
                    <div className="flex-1 min-h-[300px] rounded-2xl bg-slate-950 border border-slate-850 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                      {cameraState === 'idle' && (
                        <>
                          <Camera className="w-12 h-12 text-slate-500 mb-4 animate-pulse" />
                          <h3 className="text-sm font-semibold text-slate-300 mb-2">Mock Camera Viewfinder</h3>
                          <p className="text-xs text-slate-500 max-w-sm mb-6">Initiate secure scan capture using integrated camera interface.</p>
                          <Button variant="primary" size="sm" icon={Play} onClick={startCameraCapture}>
                            Start Capture
                          </Button>
                        </>
                      )}

                      {cameraState === 'capturing' && (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
                          <p className="text-xs font-mono text-indigo-400">ALIGNING VIEW & SNAPPING...</p>
                        </div>
                      )}

                      {cameraState === 'captured' && (
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-32 rounded-lg border border-slate-800 overflow-hidden shadow-lg mb-4 bg-slate-905 relative">
                            <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(currentPrescription.split(',')[1]) }} className="w-full h-full object-cover scale-95" />
                          </div>
                          <h3 className="text-xs font-semibold text-slate-200">Prescription Snap Success</h3>
                          <p className="text-[10px] text-slate-500 mt-1 mb-6">Camera capture resolution validated.</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => setCameraState('idle')}>
                              Retake
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: SELECT SAMPLE LIST */}
                  {activeTab === 'sample' && (
                    <div className="flex-1 min-h-[300px] flex flex-col gap-4">
                      <p className="text-xs text-slate-500 mb-2 text-left font-sans">Select a diagnostic mock script to test the OCR engine pipelines:</p>
                      
                      <div className="flex flex-col gap-3">
                        {MOCK_SAMPLES.map((sample) => (
                          <div 
                            key={sample.id}
                            onClick={() => handleSampleSelect(sample)}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                              selectedSampleId === sample.id 
                                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-primary shadow-sm' 
                                : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/40'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sample.patient}</h4>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{sample.type}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                sample.status === 'Verified' 
                                  ? 'bg-emerald-500/10 text-emerald-500' 
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {sample.status}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-705 dark:text-slate-300">{sample.drug}</p>
                            <p className="text-[10px] text-slate-500 mt-1 italic">"{sample.sig}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
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

          {/* STATE 4: SUCCESS STRUCTURED AI RESULT PREVIEW */}
          {ocrState === 'success' && aiResult && (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start font-geist"
            >
              
              {/* Left Column: Image view (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 text-left">
                  <Eye className="w-5 h-5 text-primary" />
                  Source Prescription Image
                </h2>
                
                <Card variant="glass" className="p-4 rounded-3xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900/45 relative overflow-hidden flex items-center justify-center">
                  <div className="w-full max-w-[340px] aspect-[4/5] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850/80 p-3 flex items-center justify-center relative shadow-md">
                    {currentPrescription.startsWith('data:image/svg+xml') ? (
                      <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(currentPrescription.split(',')[1]) }} className="w-full h-full object-cover scale-95" />
                    ) : (
                      <img src={currentPrescription} alt="Analyzed prescription" className="w-full h-full object-contain" />
                    )}
                    
                    {/* Bounding box mock overlay to show vision detection */}
                    <div className="absolute top-[50%] left-[8%] w-[84%] h-[8%] border-2 border-emerald-500/80 bg-emerald-500/10 rounded pointer-events-none flex items-center justify-end px-1.5 shadow-sm">
                      <span className="text-[7px] font-mono font-bold bg-emerald-500 text-white px-1 rounded transform translate-y-[-10px]">{aiResult.confidence}</span>
                    </div>
                  </div>
                </Card>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-start gap-3 text-left">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold">OCR Digitization Verified</h4>
                    <p className="text-[11px] mt-0.5 leading-relaxed font-sans">
                      AI Vision parser segmented transcription layers with a confidence of {aiResult.confidence}. Document details ready for review.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Extraction Details & Clinical Audit (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-left">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Structured Clinical Audit</h2>
                    <p className="text-xs text-slate-500 mt-1">Review the AI model outputs and verify details below.</p>
                  </div>
                  
                  {/* Toggle JSON / Card View */}
                  <div className="flex gap-1.5 p-1 bg-slate-105 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg self-start">
                    <button 
                      onClick={() => setActiveJsonTab(false)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        !activeJsonTab 
                          ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-805'
                      }`}
                    >
                      Audit View
                    </button>
                    <button 
                      onClick={() => setActiveJsonTab(true)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        activeJsonTab 
                          ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-805'
                      }`}
                    >
                      FHIR JSON
                    </button>
                  </div>
                </div>

                {!activeJsonTab ? (
                  <div className="flex flex-col gap-6 text-left font-sans">
                    
                    {/* Audit Card */}
                    <Card variant="glass" className="p-6 rounded-3xl border border-slate-205 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl flex flex-col gap-6">
                      
                      {/* Patient & Doctor metadata */}
                      <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-150 dark:border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono block">PATIENT NAME</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">{aiResult.patient}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono block">PRESCRIBING PHYSICIAN</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">{aiResult.docName}</span>
                        </div>
                      </div>

                      {/* Medication details */}
                      <div className="pb-6 border-b border-slate-150 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-500 font-mono block">EXTRACTED DRUG / MEDICATION</span>
                        <div className="flex items-center justify-between gap-4 mt-2">
                          <div>
                            <span className="text-base font-bold text-primary block">{aiResult.drug}</span>
                            <span className="text-xs text-slate-500 block mt-0.5">{aiResult.type}</span>
                          </div>
                          <Badge variant="primary" className="font-mono text-xs px-2.5 py-0.5">
                            {aiResult.confidence} Conf.
                          </Badge>
                        </div>
                      </div>

                      {/* Sig / Dosage */}
                      <div className="pb-6 border-b border-slate-150 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-500 font-mono block">DOSAGE STRUCTURING (SIG)</span>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 mt-2 leading-relaxed">
                          {aiResult.sig}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs text-slate-500">
                          <span>Dispense: <strong>{aiResult.qty}</strong></span>
                        </div>
                      </div>

                      {/* Safety Auditing Alerts */}
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block mb-3">CLINICAL SAFETY AUDIT</span>
                        {aiResult.status === 'Verified' ? (
                          <div className="p-3.5 bg-emerald-550/10 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span className="text-xs font-medium">Clear of drug-to-drug interactions & dosage safety limits.</span>
                          </div>
                        ) : (
                          <div className="p-3.5 bg-amber-500/10 border border-amber-500/15 rounded-xl flex items-center gap-3 text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span className="text-xs font-medium">Flagged: High daily cumulative dosage. Verify patient age and renal clearance.</span>
                          </div>
                        )}
                      </div>

                    </Card>

                    {/* Action Panel */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                      <Button 
                        variant="outline" 
                        icon={RefreshCw}
                        onClick={() => setOcrState('idle')}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-slate-705 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                      >
                        Rescan / Upload New
                      </Button>
                      
                      <Button 
                        variant="primary" 
                        onClick={handleApprove}
                        className={`w-full sm:w-auto px-10 py-3.5 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          aiResult.status === 'Verified' 
                            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' 
                            : 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Finalize</span>
                      </Button>
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col gap-4 text-left font-mono">
                    
                    {/* JSON panel */}
                    <Card variant="glass" className="p-6 rounded-3xl border border-slate-205 dark:border-slate-800 bg-slate-900 text-slate-300 shadow-xl relative overflow-hidden text-[11px] leading-relaxed">
                      
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button 
                          onClick={copyFhirJson}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700 cursor-pointer"
                          title="Copy JSON"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <pre className="max-h-[400px] overflow-y-auto pr-8">
                        {JSON.stringify(aiResult.fhir, null, 2)}
                      </pre>

                    </Card>

                    <p className="text-[10px] text-slate-550 dark:text-slate-400 italic font-sans">
                      * This output format follows the HL7 FHIR (Fast Healthcare Interoperability Resources) MedicationRequest schema.
                    </p>

                    <div className="flex justify-end gap-4 mt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveJsonTab(false)}
                        className="px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                      >
                        Back to Audit View
                      </Button>
                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
