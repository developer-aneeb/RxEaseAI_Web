import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Copy, Check, Eye, ArrowLeft
} from 'lucide-react';
import { usePrescriptionStore } from '../../store/usePrescriptionStore';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Navbar from '../../components/layout/Navbar';

export default function ResultPage() {
  const { 
    currentPrescription, 
    aiResult, 
    resetStore
  } = usePrescriptionStore();

  const showToast = useAppStore((state) => state.showToast);

  const [copied, setCopied] = useState(false);
  const [activeJsonTab, setActiveJsonTab] = useState(false); // view raw FHIR JSON

  useEffect(() => {
    if (!aiResult || !currentPrescription) {
      showToast('No clinical analysis results found. Please upload or scan a prescription first.', 'warning');
      window.location.hash = '#upload';
    }
  }, [aiResult, currentPrescription, showToast]);

  const copyFhirJson = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(JSON.stringify(aiResult.fhir, null, 2));
    setCopied(true);
    showToast('FHIR JSON copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = () => {
    showToast('Prescription approved and logged in clinical registry.', 'success');
    resetStore();
    window.location.hash = '#home';
  };

  const resultLinks = [
    { name: 'Home', href: '#home' },
    { name: 'New Upload', href: '#upload' },
    { name: 'Results', href: '#result' },
  ];

  if (!aiResult || !currentPrescription) {
    return null;
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

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Context & Trust (40% / 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Prescription Preview Card */}
              <Card variant="glass" className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Original Document</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">RX_2026_07_04.jpg • Uploaded 10:42 AM</p>
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
              </Card>

              {/* Processing Summary Cards */}
              <Card variant="glass" className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                    <span className="text-base font-extrabold text-primary">{aiResult.confidence}</span>
                    <span className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider mt-1">OCR Conf.</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                    <span className="text-base font-extrabold text-emerald-500">{aiResult.accuracy}</span>
                    <span className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider mt-1 font-sans">Accuracy</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800">
                    <span className={`text-base font-extrabold ${aiResult.verification === 'High' ? 'text-indigo-500' : 'text-amber-500'}`}>{aiResult.verification}</span>
                    <span className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider mt-1 font-sans">Audit Status</span>
                  </div>
                </div>

                {/* Extraction Pipeline */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Extraction Pipeline</h3>
                  <div className="relative pl-6 flex flex-col gap-4 mt-2">
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                    
                    {/* Step 1 */}
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-300">Image Pre-processing</span>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-300">Handwriting OCR (YOLO)</span>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm ${
                        aiResult.verification === 'High' ? 'bg-indigo-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      </div>
                      <span className="text-xs text-slate-800 dark:text-slate-200 font-bold">Clinical Safety Auditing</span>
                    </div>
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
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    aiResult.verification === 'High'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}>
                    <MaterialIcon name={aiResult.verification === 'High' ? "verified" : "warning"} size="sm" className="text-[12px] mr-0.5" />
                    <span>{aiResult.verification === 'High' ? "Verification Successful" : "Audit Flagged"}</span>
                  </div>
                </div>

                {/* Tab Selectors */}
                <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg self-start">
                  <button 
                    onClick={() => setActiveJsonTab(false)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border-0 ${
                      !activeJsonTab 
                        ? 'bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm' 
                        : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    Clinical Details
                  </button>
                  <button 
                    onClick={() => setActiveJsonTab(true)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border-0 ${
                      activeJsonTab 
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
                    {aiResult.medications?.map((med, index) => (
                      <Card 
                        key={index} 
                        variant="glass" 
                        className={`p-5 rounded-3xl border text-left ${
                          index === 0 
                            ? 'border-indigo-500/20 shadow-lg shadow-indigo-500/5 bg-white/80 dark:bg-slate-900/80' 
                            : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50'
                        } flex flex-col gap-4`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4 items-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              index === 0 
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                              <MaterialIcon name={med.icon} />
                            </div>
                            <div>
                              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                {med.name}
                                <span className="material-symbols-outlined text-emerald-500 text-[18px]" title="Database Verified">check_circle</span>
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">{med.type}</p>
                            </div>
                          </div>
                          
                          <Badge variant={index === 0 ? "primary" : "outline"} className="text-[10px] font-bold px-2 py-0.5">
                            Match: {med.match}
                          </Badge>
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

                  {/* Bento Style Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Bento Card 1: Generic Alternatives */}
                    <div className="p-5 rounded-3xl border border-indigo-500/10 bg-gradient-to-br from-white/70 to-slate-50 dark:from-slate-900/60 dark:to-slate-950/40 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-[72px] text-primary">psychology</span>
                      </div>
                      
                      <div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-3 text-[9px] font-bold uppercase tracking-wider border border-indigo-500/15">
                          <span className="material-symbols-outlined text-[12px] mr-0.5">lightbulb</span>
                          <span>AI Insight</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{aiResult.bento?.generic.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-sans">{aiResult.bento?.generic.desc}</p>
                      </div>

                      <div className="flex items-center justify-between bg-slate-100/50 dark:bg-slate-950/50 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 mt-4">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{aiResult.bento?.generic.savings}</span>
                        <button 
                          onClick={() => showToast(`Calculating alternative generic brands for ${aiResult.drug}...`, 'info')}
                          className="text-[10px] font-bold text-primary hover:underline cursor-pointer border-0 bg-transparent"
                        >
                          View Options
                        </button>
                      </div>
                    </div>

                    {/* Bento Card 2: Safety Audit Check */}
                    <div className={`p-5 rounded-3xl border flex flex-col gap-3 min-h-[160px] ${
                      aiResult.bento?.safety.status === 'passed'
                        ? 'border-emerald-500/10 bg-white/70 dark:bg-slate-900/60'
                        : 'border-amber-500/15 bg-white/70 dark:bg-slate-900/60'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          aiResult.bento?.safety.status === 'passed' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          <span className="material-symbols-outlined text-[20px]">{aiResult.bento?.safety.status === 'passed' ? 'health_and_safety' : 'warning'}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {aiResult.bento?.safety.status === 'passed' ? 'Safety Checks Cleared' : 'Safety Alerts Raised'}
                        </h4>
                      </div>

                      <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-2 mt-2 leading-normal font-sans">
                        {aiResult.bento?.safety.rules.map((rule, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2">
                            <span className={`material-symbols-outlined text-[14px] shrink-0 mt-0.5 ${
                              aiResult.bento?.safety.status === 'passed' ? 'text-emerald-500' : 'text-amber-500'
                            }`}>
                              {aiResult.bento?.safety.status === 'passed' ? 'check' : 'warning'}
                            </span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

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
                      {JSON.stringify(aiResult.fhir, null, 2)}
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
                  <span>Continue to Reminders</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Button>
                
                <button 
                  onClick={() => showToast('Prescription saved to clinical history registry.', 'success')}
                  className="flex-1 sm:flex-none py-3.5 px-6 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Save to History</span>
                </button>
                
                <button 
                  onClick={() => showToast('Generating medical audit PDF report download...', 'info')}
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
    </div>
  );
}
