import React from 'react';
import Card from '../../components/ui/Card';
import { AlertTriangle, AlertOctagon, HelpCircle, Activity, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function MedicineInfo({ selectedMed }) {
  if (!selectedMed) {
    return (
      <div className="p-8 text-center text-slate-400 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm min-h-[300px] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">No Medicine Selected</h4>
          <p className="text-xs text-slate-500 mt-1">Select a medicine card from the search results to view exhaustive clinical information.</p>
        </div>
      </div>
    );
  }

  return (
    <Card variant="glass" className="p-6 shadow-2xl border-l-4 border-l-primary relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl">
      <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-bl-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6 gap-3 text-left">
        <div>
          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {selectedMed.brand || 'RxEase Database Item'}
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">{selectedMed.name}</h3>
          <p className="text-xs font-bold text-primary mt-1">{selectedMed.composition?.generic_name || 'Generic Formulation'}</p>
        </div>
        <div className="shrink-0">
          {selectedMed.prescription_required ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
              Rx Req
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              OTC Item
            </span>
          )}
        </div>
      </div>

      {/* Market pricing banner */}
      <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 mb-6 text-left">
        <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">Official Market Price</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-800 dark:text-white">Rs. {selectedMed.price?.total_price || '0'}</span>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500"> / {selectedMed.price?.pack_size || 'unit'}</span>
        </div>
      </div>

      <div className="text-left space-y-5 font-sans">
        
        {/* Strength */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Formulation Strength</span>
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-350 font-bold bg-slate-100/50 dark:bg-slate-950/40 py-2 px-3 rounded-xl border border-slate-200/20">
            {selectedMed.composition?.strength || 'Standard strength not specified'}
          </p>
        </div>

        {/* Primary uses */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Primary Uses</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedMed.primary_uses?.map((use, idx) => (
              <span key={idx} className="text-xs font-semibold bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 px-3 py-1 rounded-xl">
                {use}
              </span>
            )) || <p className="text-xs italic text-slate-500">No primary uses documented.</p>}
          </div>
        </div>

        {/* Indications */}
        {selectedMed.indications && selectedMed.indications.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Indications</span>
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-350 space-y-1 ml-1 leading-relaxed">
              {selectedMed.indications.map((ind, idx) => (
                <li key={idx} className="marker:text-blue-500">{ind}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Side Effects */}
        {selectedMed.side_effects && selectedMed.side_effects.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Side Effects</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedMed.side_effects.map((se, idx) => (
                <span key={idx} className="text-xs font-semibold bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10 px-2.5 py-1 rounded-xl">
                  {se}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contraindications */}
        {selectedMed.contraindications && selectedMed.contraindications.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 text-rose-500">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Contraindications</span>
            </h4>
            <ul className="list-disc list-inside text-xs text-rose-500 dark:text-rose-400/90 space-y-1 ml-1 leading-relaxed">
              {selectedMed.contraindications.map((ci, idx) => (
                <li key={idx} className="marker:text-rose-500">{ci}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {selectedMed.warnings && Object.keys(selectedMed.warnings).length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-2 flex items-center gap-1.5 text-amber-500">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Warnings & Precautions</span>
            </h4>
            <div className="space-y-2">
              {Object.entries(selectedMed.warnings).map(([key, val]) => (
                <div key={key} className="p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[9px] tracking-wide block mb-1">{key}</span>
                  <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
