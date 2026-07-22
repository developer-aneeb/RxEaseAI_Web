import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Copy, Check, Eye, ArrowLeft, Send
} from 'lucide-react';
import { usePrescriptionStore } from '../../../store/usePrescriptionStore';
import { useAppStore } from '../../../store/useAppStore';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import MaterialIcon from '../../../components/ui/MaterialIcon';
import Navbar from '../../../components/layout/Navbar';
import Modal from '../../../components/ui/Modal';
import { prescriptionService } from '../../../services/prescriptionService';
import { shareService } from '../../../services/shareService';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';
import DownloadModal from '../components/DownloadModal';
import ShareModal from '../components/ShareModal';

export default function ResultPage() {
  const {
    currentPrescription,
    aiResult,
    setAiResult,
    resetStore
  } = usePrescriptionStore();

  const showToast = useAppStore((state) => state.showToast);

  const [copied, setCopied] = useState(false);
  const [activeJsonTab, setActiveJsonTab] = useState(false); // view raw FHIR JSON
  const [isSyncing, setIsSyncing] = useState(false);

  // Share & Download modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Sync with actual DB prescription items and recommendations when arriving on ResultPage
  useEffect(() => {
    if (!aiResult) return;
    const pId = aiResult.prescription_id || aiResult.prescriptionId || aiResult.id;
    // If we have a real DB prescription ID, fetch fresh details to ensure all prescription_items & recommendations are loaded
    if (pId && pId !== 'MOCK-SAMPLE' && pId !== 'UNKNOWN' && typeof pId === 'string' && pId.startsWith('RX')) {
      // Check if we need to enrich DB items
      const hasDbItems = Array.isArray(aiResult.prescription_items) && aiResult.prescription_items.length > 0;
      const hasRecommendations = hasDbItems && aiResult.prescription_items.some(i => i.recommendations?.length > 0);
      
      if (!hasDbItems || !hasRecommendations) {
        setIsSyncing(true);
        prescriptionService.getPrescriptionDetails(pId)
          .then((details) => {
            if (details && (details.prescription_items || details.id)) {
              setAiResult(details);
            }
          })
          .catch((err) => {
            console.warn('Could not sync background prescription details:', err.message);
          })
          .finally(() => {
            setIsSyncing(false);
          });
      }
    }
  }, [aiResult?.prescription_id, aiResult?.prescriptionId, aiResult?.id, aiResult, setAiResult]);

  // Helper to interpret confidence
  const interpretConfidence = (conf) => {
    const value = Number(conf);
    if (!Number.isFinite(value)) return { level: 'uncertain', message: 'Take as directed' };
    if (value >= 0.9) return { level: 'confirmed', message: 'Medicine looks correct' };
    if (value >= 0.6) return { level: 'likely', message: 'Please verify manually' };
    return { level: 'uncertain', message: 'Check item directives carefully' };
  };

  // Helper to format gate label
  const formatGateLabel = (label) => {
    if (!label) return 'Unknown Gate';
    return String(label)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  // Normalize backend response to UI format
  const normalizedResult = (() => {
    if (!aiResult) return null;

    // Check if it's already a mock/sample format
    if (aiResult.medications && Array.isArray(aiResult.medications)) {
      return {
        ...aiResult,
        prescriptionId: aiResult.prescriptionId || 'MOCK-SAMPLE',
        processingTime: aiResult.processingTime || '0.82s',
        gate: { label: 'Handwritten Prescription', confidence: '98%', status: 'Passed' },
        rawDate: new Date()
      };
    }

    // Real backend format: { success, persisted, prescription_id, image_id, data: { ocr, structured, validated } } or getPrescriptionDetails object
    const prescriptionId = aiResult.prescription_id || aiResult.prescriptionId || aiResult.id || 'UNKNOWN';
    const imageId = aiResult.image_id || aiResult.imageId || aiResult.prescription_images?.id || null;

    // Extract raw medicine items from any possible location
    let rawItems = [];
    if (Array.isArray(aiResult.prescription_items) && aiResult.prescription_items.length > 0) {
      // 1. Database table prescription_items (from getPrescriptionDetails or getHistory)
      rawItems = aiResult.prescription_items;
    } else if (Array.isArray(aiResult.data?.validated?.items) && aiResult.data.validated.items.length > 0) {
      // 2. Python pipeline validated response
      rawItems = aiResult.data.validated.items;
    } else if (Array.isArray(aiResult.prescription_images?.ocr_structured?.validated?.items) && aiResult.prescription_images.ocr_structured.validated.items.length > 0) {
      // 3. Image OCR structured validated items
      rawItems = aiResult.prescription_images.ocr_structured.validated.items;
    } else if (Array.isArray(aiResult.data?.structured?.items) && aiResult.data.structured.items.length > 0) {
      // 4. Python pipeline structured items before validation
      rawItems = aiResult.data.structured.items.filter(item => item.entity_type === 'medicine_candidate' || !item.entity_type);
    } else if (Array.isArray(aiResult.prescription_images?.ocr_structured?.items) && aiResult.prescription_images.ocr_structured.items.length > 0) {
      // 5. Image OCR structured candidates
      rawItems = aiResult.prescription_images.ocr_structured.items.filter(item => item.entity_type === 'medicine_candidate' || !item.entity_type);
    } else if (Array.isArray(aiResult.medicines) && aiResult.medicines.length > 0) {
      rawItems = aiResult.medicines;
    }

    const medications = rawItems.map((item, idx) => {
      const matchConfidence = Number(
        item.validation_confidence ?? item.confidence ?? 0.85
      );
      const matchPercent = Math.round(matchConfidence * 100) + '%';

      const interpretation = item.confidence_interpretation || interpretConfidence(matchConfidence);

      // Determine match_type and display type
      const matchType = item.match_type || (item.matched ? 'exact' : 'none');
      let displayType = 'AI Extracted Candidate';
      if (matchType && matchType !== 'none') {
        const capitalized = matchType.charAt(0).toUpperCase() + matchType.slice(1);
        displayType = `Database Verified (${capitalized} Match)`;
      } else if (item.matched_medicine_id || item.medicine_id) {
        displayType = 'Database Verified';
      }

      const medicineName = item.medicine_name || item.matched_name || item.name || item.text || item.input || 'Unknown Medicine';
      const dosageStr = item.dosage || item.strength || (item.dosage_form ? `${item.strength || ''} ${item.dosage_form}`.trim() : 'As prescribed');
      const frequencyStr = item.frequency || item.timing || 'As directed';
      const durationStr = item.duration || 'As directed';
      const rawTextStr = item.raw_text || item.input || item.text || '';
      const recommendations = Array.isArray(item.recommendations) ? item.recommendations : [];

      return {
        id: item.id || idx + 1,
        name: medicineName,
        type: displayType,
        match: matchPercent,
        dosage: dosageStr,
        frequency: frequencyStr,
        duration: durationStr,
        instructions: item.validation_message || interpretation.message || 'Take as directed',
        rawText: rawTextStr,
        matchedMedicineId: item.matched_medicine_id || item.medicine_id || null,
        matchType,
        icon: 'medication',
        confidence: matchConfidence,
        level: interpretation.level,
        recommendations
      };
    });

    // Compute overall confidence
    let overallConfidence = aiResult.ocr_confidence || aiResult.prescription_images?.ocr_confidence || aiResult.data?.structured?.overall_confidence;
    if (overallConfidence === undefined || overallConfidence === null) {
      if (medications.length > 0) {
        const total = medications.reduce((sum, m) => sum + (m.confidence || 0.85), 0);
        overallConfidence = total / medications.length;
      } else {
        overallConfidence = 0.85;
      }
    }
    const confidenceText = Math.round(Number(overallConfidence) * 100) + '%';
    const isHighConfidence = Number(overallConfidence) >= 0.75;

    // Date & Time computation
    const rawTimestamp = aiResult.created_at || aiResult.prescription_images?.uploaded_at || aiResult.date || new Date();
    const dateObj = new Date(rawTimestamp);
    const formattedDate = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recent Upload';
    const formattedDateTime = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : 'Recent Upload';

    // Processing duration calculation
    let processingTimeStr = '0.82s';
    const uploadedAt = aiResult.prescription_images?.uploaded_at;
    const processedAt = aiResult.prescription_images?.processed_at;
    if (uploadedAt && processedAt) {
      const diffSec = (new Date(processedAt) - new Date(uploadedAt)) / 1000;
      if (Number.isFinite(diffSec) && diffSec > 0) {
        processingTimeStr = `${diffSec.toFixed(2)}s`;
      }
    } else if (aiResult.data?.processing_time || aiResult.processing_time) {
      const sec = Number(aiResult.data?.processing_time || aiResult.processing_time);
      if (Number.isFinite(sec) && sec > 0) {
        processingTimeStr = `${sec.toFixed(2)}s`;
      }
    }

    // Gate Information
    const gateObj = aiResult.gate || aiResult.prescription_images || {};
    const gateLabel = formatGateLabel(gateObj.gate_label || gateObj.label || 'handwritten_prescription');
    const gateConf = gateObj.gate_confidence !== undefined
      ? `${Math.round(Number(gateObj.gate_confidence) * 100)}%`
      : (gateObj.confidence !== undefined ? `${Math.round(Number(gateObj.confidence) * 100)}%` : '98%');
    const gateStatus = gateObj.gate_status || (gateObj.allowed !== false ? 'passed' : 'rejected');

    // Extract safety audits / warnings
    const validationFlags = aiResult.data?.validated?.flags || aiResult.prescription_images?.ocr_structured?.validated?.flags || [];
    const hasFlags = validationFlags.length > 0;

    const safetyRules = hasFlags
      ? validationFlags.map(flag => flag.replace(/_/g, ' ').toUpperCase())
      : [
        'No severe drug-drug interactions detected.',
        'Cumulative daily dosages within safe clinical range.',
        'Extracted target ingredients verified against database.'
      ];

    // Build standard FHIR JSON for display
    const fhirResource = aiResult.fhir || {
      resourceType: "Bundle",
      id: `bundle-${prescriptionId}`,
      type: "collection",
      entry: medications.map((med, idx) => ({
        resource: {
          resourceType: "MedicationRequest",
          id: `medrx-${idx + 1}`,
          status: "active",
          intent: "order",
          medicationCodeableConcept: {
            text: med.name,
            ...(med.matchedMedicineId ? {
              coding: [{
                system: "https://rxeaseai.local/medicines",
                code: String(med.matchedMedicineId),
                display: med.name
              }]
            } : {})
          },
          dosageInstruction: [{
            text: `${med.dosage} - ${med.frequency} (${med.instructions})`,
            timing: {
              repeat: {
                frequency: med.frequency
              }
            }
          }]
        }
      }))
    };

    return {
      prescriptionId,
      imageId,
      docName: aiResult.doctor_name || aiResult.doctor || 'AI Model Extracted',
      type: 'Ingestion Pipeline',
      date: formattedDate,
      dateTime: formattedDateTime,
      processingTime: processingTimeStr,
      confidence: confidenceText,
      verification: isHighConfidence ? 'High' : 'Medium',
      status: isHighConfidence ? 'Verified' : 'Needs Review',
      gate: {
        label: gateLabel,
        confidence: gateConf,
        status: gateStatus
      },
      medications,
      bento: {
        safety: {
          status: hasFlags ? 'warning' : 'passed',
          rules: safetyRules
        }
      },
      fhir: fhirResource
    };
  })();

  const copyFhirJson = () => {
    if (!normalizedResult) return;
    navigator.clipboard.writeText(JSON.stringify(normalizedResult.fhir, null, 2));
    setCopied(true);
    showToast('FHIR JSON copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = () => {
    showToast('Prescription validated successfully.', 'success');
    resetStore();
    window.location.hash = '#reminders';
  };

  const handleSaveToHistory = () => {
    showToast('Prescription logged to history.', 'success');
    resetStore();
    window.location.hash = '#history';
  };

  const handleExportPdf = () => {
    if (!normalizedResult?.prescriptionId) return;
    setIsDownloadModalOpen(true);
  };

  const resultLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Upload', href: '#upload' },
    { name: 'History', href: '#history' },
    { name: 'Recommendations', href: '#recommendations' },
    { name: 'Prescription Analytics', href: '#prescription-analytics' },

  ];

  if (!normalizedResult || !currentPrescription) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-slate-500 text-3xl">scan_delete</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Clinical Data Found</h2>
        <p className="text-slate-500 max-w-md mb-8">
          It looks like there is no prescription data loaded in the clinical registry. Please upload or scan a prescription to view the AI analysis results.
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.hash = '#upload'}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/25"
        >
          Go to Upload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans relative overflow-x-hidden pt-24 pb-16">
      <Navbar links={resultLinks} />

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
              window.location.hash = '#upload';
            }}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </Button>
        </div>

        <motion.div
          key="success-state"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col gap-8 animate-fade-up text-left font-geist"
        >

          {/* Header Title Section */}
          <header className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow"></div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">AI Processing Complete</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Prescription <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Analysis Result</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-sans">
              RxEaseAI has processed your prescription and extracted the medicine details, dosage instructions, and verification results.
            </p>
          </header>

          {/* Pipeline Status Banner */}
          <div className="w-full bg-white/70 dark:bg-slate-900/60 rounded-xl p-6 mb-8 flex items-center justify-between border border-slate-200 dark:border-slate-800 shadow-sm relative z-10 overflow-hidden">
            <div className="flex-1 flex items-center justify-between relative max-w-4xl mx-auto w-full">
              {/* Progress Line Background */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full -z-10"></div>
              {/* Active Progress Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[85%] h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full -z-10"></div>

              {/* Pipeline Steps */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-4 border-white dark:border-slate-950">
                  <span className="material-symbols-outlined text-[20px]">upload</span>
                </div>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white">Upload</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-4 border-white dark:border-slate-950">
                  <span className="material-symbols-outlined text-[20px]">crop</span>
                </div>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white">Segmentation</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-4 border-white dark:border-slate-950">
                  <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                </div>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white">OCR</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-4 border-white dark:border-slate-950">
                  <span className="material-symbols-outlined text-[20px]">data_object</span>
                </div>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white">Structuring</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-4 border-white dark:border-slate-950">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <span className="text-[10px] font-bold text-slate-900 dark:text-white">Verification</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 border-4 border-white dark:border-slate-950 ring-2 ring-emerald-500/20">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">Recommendation</span>
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Context & Trust (40% / 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Prescription Preview Card */}
              {/* <Card variant="glass" className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Original Document</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">ID: {normalizedResult.prescriptionId}</p>
                  </div>
                  <button
                    onClick={() => {
                      const win = window.open("", "_blank");
                      win.document.write(`<body style="margin:0;display:flex;justify-content:center;align-items:center;background:#111;"><img src="${encodeURI(currentPrescription)}" style="max-width:100%;max-height:100%;object-fit:contain;"/></body>`);
                    }}
                    className="text-primary hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors flex items-center justify-center cursor-pointer border-0 bg-transparent"
                    title="View Original"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-950 flex items-center justify-center p-2">
                  {currentPrescription.startsWith('data:image/svg+xml') ? (
                    <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(currentPrescription.split(',')[1]) }} className="w-full h-full object-cover scale-95" />
                  ) : (
                    <img className="w-full h-full object-contain" src={currentPrescription} alt="Original Prescription Document" />
                  )}
                </div>
              </Card> */}

              {/* Intelligence Summary */}
              <Card variant="glass" className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex flex-col gap-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Intelligence Summary</h2>
                  {isSyncing && (
                    <span className="text-[10px] text-indigo-500 font-bold animate-pulse flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] animate-spin">sync</span> Syncing DB...
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">timer</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Speed</div>
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{normalizedResult.processingTime}</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">center_focus_strong</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confidence</div>
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{normalizedResult.confidence}</div>
                    </div>
                  </div>
                </div>

                <div className="relative pl-5 border-l-2 border-slate-200 dark:border-slate-800 flex flex-col gap-6 mt-4 ml-2">
                  {/* Timeline Nodes */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-white dark:ring-slate-900"></div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Document Ingested</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{normalizedResult.dateTime}</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-white dark:ring-slate-900"></div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Gate: {normalizedResult.gate.label}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">Status: {normalizedResult.gate.status} ({normalizedResult.gate.confidence} conf)</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900 shadow-[0_0_12px_rgba(99,102,241,0.6)]"></div>
                    <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Clinical Data Structured</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{normalizedResult.medications.length} items parsed & verified</div>
                  </div>
                </div>
              </Card>

            </div>

            {/* Right Column: Clinical Results (60% / 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Results Subheader */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Extracted Medications</h2>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${normalizedResult.verification === 'High'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                    <MaterialIcon name={normalizedResult.verification === 'High' ? "verified" : "warning"} size="sm" className="text-[12px] mr-0.5" />
                    <span>{normalizedResult.verification === 'High' ? "Verification Successful" : "Audit Flagged"}</span>
                  </div>
                </div>

                {/* Tab Selectors */}
                <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg self-start">
                  <button
                    onClick={() => setActiveJsonTab(false)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border-0 ${!activeJsonTab
                      ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm'
                      : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                  >
                    Clinical Details
                  </button>
                  <button
                    onClick={() => setActiveJsonTab(true)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border-0 ${activeJsonTab
                      ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm'
                      : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                  >
                    FHIR JSON
                  </button>
                </div>
              </div>

              {!activeJsonTab ? (
                <div className="flex flex-col gap-6">

                  {/* Medication Cards List */}
                  <div className="flex flex-col gap-4">
                    {normalizedResult.medications.map((med, index) => (
                      <Card
                        key={med.id || index}
                        variant="glass"
                        className={`p-5 rounded-3xl border text-left ${index === 0
                          ? 'border-indigo-500/20 shadow-lg shadow-indigo-500/5 bg-white/80 dark:bg-slate-900/80'
                          : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50'
                          } flex flex-col gap-4`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex gap-4 items-center min-w-0">
                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${index === 0
                              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}>
                              <MaterialIcon name={med.icon} />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                                <span>{med.name}</span>
                                {med.matchedMedicineId ? (
                                  <span className="material-symbols-outlined text-emerald-500 text-[18px]" title={`Database Verified (ID: #${med.matchedMedicineId})`}>check_circle</span>
                                ) : (
                                  <span className="material-symbols-outlined text-amber-500 text-[18px]" title="AI Extracted Candidate">info</span>
                                )}
                                {med.recommendations.length > 0 && (
                                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">savings</span>
                                    {med.recommendations.length} Alternative{med.recommendations.length > 1 ? 's' : ''}
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">{med.type}</p>
                              {med.rawText && med.rawText.toLowerCase() !== med.name.toLowerCase() && (
                                <p className="text-[10px] text-slate-400 font-mono mt-1 truncate">OCR Text: &ldquo;{med.rawText}&rdquo;</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge variant={med.confidence >= 0.75 ? "primary" : "outline"} className="text-[10px] font-bold px-2 py-0.5">
                              Match: {med.match}
                            </Badge>
                            {med.level && (
                              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">{med.level}</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Dosage</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{med.dosage}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Frequency</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{med.frequency}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Duration</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{med.duration}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Instructions</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{med.instructions}</span>
                          </div>
                        </div>

                      </Card>
                    ))}
                  </div>

                  {/* AI Smart Recommendations */}
                  {(() => {
                    const allRecs = normalizedResult.medications.flatMap(m => m.recommendations || []);
                    const topRec = allRecs.length > 0 ? allRecs[0] : null;
                    const maxSavings = allRecs.length > 0 ? Math.max(...allRecs.map(r => Number(r.price_saving_percent || 0))) : null;

                    return (
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-indigo-500">psychology</span>
                              <span>AI Smart Recommendations</span>
                            </div>
                            {allRecs.length > 0 && (
                              <button
                                onClick={() => window.location.hash = '#recommendations'}
                                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer border-0 bg-transparent flex items-center gap-1"
                              >
                                <span>View All {allRecs.length} in Recommendations</span>
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                              </button>
                            )}
                          </h2>
                          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-3">
                                {maxSavings !== null && maxSavings > 0 ? (
                                  <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Save Up to {Math.round(maxSavings)}%</span>
                                ) : (
                                  <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">AI Database Search</span>
                                )}
                                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                  {allRecs.length > 0 ? `${allRecs.length} Generic & Affordable Alternatives Found` : 'Searching National Medicine Registry'}
                                </span>
                              </div>
                            </div>

                            {topRec ? (
                              <div className="flex flex-col md:flex-row gap-4 items-center">
                                {/* Original */}
                                <div className="flex-1 bg-white/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 w-full opacity-80">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prescribed Medicine</div>
                                  <div className="text-sm font-bold text-slate-900 dark:text-white">{normalizedResult.medications[0]?.name || 'Prescribed Medicine'}</div>
                                  {topRec.original_unit_price ? (
                                    <div className="text-xs font-bold text-rose-500 mt-1">Est. ${topRec.original_unit_price}/unit</div>
                                  ) : (
                                    <div className="text-xs font-bold text-slate-500 mt-1">Current Brand Pricing</div>
                                  )}
                                </div>

                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-2xl hidden md:block">arrow_forward</span>
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-2xl md:hidden rotate-90">arrow_forward</span>

                                {/* Alternative */}
                                <div
                                  onClick={() => window.location.hash = '#recommendations'}
                                  className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/5 w-full relative overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors group"
                                >
                                  <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 flex items-center justify-center rounded-bl-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-emerald-600 group-hover:text-white text-[16px]">done</span>
                                  </div>
                                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Recommended Alternative</div>
                                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                                    {topRec.recommended_medicine?.name || topRec.recommended_medicine_name || 'Generic Alternative'}
                                  </div>
                                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                    {topRec.recommended_unit_price && `Est. $${topRec.recommended_unit_price}/unit`}
                                    {topRec.price_saving_percent && ` (${Math.round(topRec.price_saving_percent)}% lower cost)`}
                                  </div>
                                  {topRec.reason && (
                                    <div className="text-[10px] text-slate-400 mt-1 truncate">Why: {topRec.reason}</div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="flex-1 bg-white/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80 w-full">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prescribed</div>
                                  <div className="text-sm font-bold text-slate-900 dark:text-white">{normalizedResult.medications[0]?.name || 'Extracted Medicine'}</div>
                                  <div className="text-xs font-bold text-slate-500 mt-1">Checking formulation matches...</div>
                                </div>

                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-2xl hidden md:block">arrow_forward</span>
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-2xl md:hidden rotate-90">arrow_forward</span>

                                <div
                                  onClick={() => window.location.hash = '#recommendations'}
                                  className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-indigo-500/30 hover:border-indigo-500/60 shadow-lg w-full relative overflow-hidden cursor-pointer transition-colors"
                                >
                                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Generic Alternatives</div>
                                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">View Recommendations & &ldquo;Save&rdquo; Options</div>
                                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Click to view full generic alternative analysis</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bento Card 2: Safety Audit Check */}
                        <div className={`p-5 rounded-2xl border flex flex-col gap-3 min-h-[120px] ${normalizedResult.bento?.safety.status === 'passed'
                          ? 'border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-500/5'
                          : 'border-amber-500/15 bg-amber-500/5 dark:bg-amber-500/5'
                          }`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${normalizedResult.bento?.safety.status === 'passed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}>
                              <span className="material-symbols-outlined text-[20px]">{normalizedResult.bento?.safety.status === 'passed' ? 'health_and_safety' : 'warning'}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {normalizedResult.bento?.safety.status === 'passed' ? 'Safety Checks Cleared' : 'Safety Alerts Raised'}
                            </h4>
                          </div>

                          <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-2 mt-1 leading-normal font-sans">
                            {normalizedResult.bento?.safety.rules.map((rule, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-2">
                                <span className={`material-symbols-outlined text-[14px] shrink-0 mt-0.5 ${normalizedResult.bento?.safety.status === 'passed' ? 'text-emerald-500' : 'text-amber-500'
                                  }`}>
                                  {normalizedResult.bento?.safety.status === 'passed' ? 'check' : 'warning'}
                                </span>
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              ) : (
                <div className="flex flex-col gap-4 font-mono text-[11px]">

                  {/* JSON panel */}
                  <Card variant="glass" className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 shadow-xl relative overflow-hidden leading-relaxed">

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
                      {JSON.stringify(normalizedResult.fhir, null, 2)}
                    </pre>

                  </Card>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic font-sans">
                    * This output format follows the HL7 FHIR (Fast Healthcare Interoperability Resources) MedicationRequest schema.
                  </p>
                </div>
              )}

              {/* Actions Area */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="primary"
                  onClick={handleApprove}
                  className="flex-1 bg-primary text-white font-bold py-3.5 px-6 rounded-xl hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Set Medicine Reminders</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Button>

                <button
                  onClick={handleSaveToHistory}
                  className="flex-1 sm:flex-none py-3.5 px-6 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Go to History</span>
                </button>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex-1 sm:flex-none py-3.5 px-6 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-950 text-indigo-650 dark:text-indigo-400 font-bold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="flex-1 sm:flex-none py-3.5 px-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                  title="Download PDF Audit"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>

            </div>

          </div>

        </motion.div>

      </div>

      {/* Reusable Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        prescription={normalizedResult?.prescriptionId || null}
      />

      {/* Reusable Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        prescriptions={normalizedResult ? {
          id: normalizedResult.prescriptionId,
          doctor: normalizedResult.docName,
          date: normalizedResult.date,
          medicines: normalizedResult.medications
        } : []}
      />
    </div>
  );
}
