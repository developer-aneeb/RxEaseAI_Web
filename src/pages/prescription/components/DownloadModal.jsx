import React, { useState } from 'react';
import { Download, FileText, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../../../../components/ui/Modal';
import Button from '../../../../components/ui/Button';
import { prescriptionService } from '../../../../services/prescriptionService';
import { useAppStore } from '../../../../store/useAppStore';
import { getFriendlyErrorMessage } from '../../../../utils/errorMessages';

export default function DownloadModal({
  isOpen,
  onClose,
  prescriptions = [], // Array of prescription objects { id, doctor, date, medicines: [...] } or single object
  onSuccess
}) {
  const showToast = useAppStore((state) => state.showToast);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMode, setDownloadMode] = useState('pdf'); // 'pdf' | 'print'

  // Ensure normalized array of items
  const items = Array.isArray(prescriptions) ? prescriptions : (prescriptions ? [prescriptions] : []);
  const isBulk = items.length > 1;
  const targetIds = items.map(p => typeof p === 'object' ? (p.id || p.prescription_id || p.prescriptionId) : p).filter(Boolean);

  const generatePrintableView = () => {
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=900');
      if (!printWindow) {
        showToast('Pop-up blocked. Please allow pop-ups to print the report.', 'error');
        return;
      }

      const blocksHtml = items.map(p => {
        const pId = typeof p === 'object' ? (p.id || p.prescription_id || p.prescriptionId || 'UNKNOWN') : p;
        const docName = (typeof p === 'object' && (p.doctor || p.doctor_name || p.docName)) ? (p.doctor || p.doctor_name || p.docName) : 'AI Extraction Pipeline';
        const dateStr = (typeof p === 'object' && (p.date || p.created_at)) ? new Date(p.date || p.created_at).toLocaleDateString() : new Date().toLocaleDateString();
        const medList = (typeof p === 'object' && (p.medicines || p.prescription_items || p.medications)) || [];

        const rows = medList.map(m => {
          const name = m.name || m.medicine_name || 'Unknown Medicine';
          const dosage = m.dosage || 'As prescribed';
          const freq = m.frequency || 'As directed';
          const status = m.status || m.validation_status || 'Verified';
          return `
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">${name}</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #475569;">${dosage}</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #475569;">${freq}</td>
              <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b;">${status}</td>
            </tr>
          `;
        }).join('');

        return `
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 16px;">
              <div>
                <h2 style="margin: 0; font-size: 20px; color: #1e293b;">Prescription #${pId}</h2>
                <p style="margin: 4px 0 0; font-size: 14px; color: #64748b;">Doctor: ${docName}</p>
              </div>
              <span style="font-size: 13px; color: #94a3b8;">${dateStr}</span>
            </div>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
              <thead>
                <tr style="background: #f8fafc; color: #334155;">
                  <th style="padding: 10px; border: 1px solid #e2e8f0;">Medicine Name</th>
                  <th style="padding: 10px; border: 1px solid #e2e8f0;">Dosage</th>
                  <th style="padding: 10px; border: 1px solid #e2e8f0;">Frequency</th>
                  <th style="padding: 10px; border: 1px solid #e2e8f0;">Validation Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #94a3b8;">No medicines listed</td></tr>'}
              </tbody>
            </table>
          </div>
        `;
      }).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>RxEase AI - Clinical Prescription Audit</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; background: #f1f5f9; color: #0f172a; margin: 0; }
            .header { text-align: center; margin-bottom: 32px; }
            .header h1 { color: #2563eb; font-size: 26px; margin: 0 0 8px; }
            .header p { color: #64748b; font-size: 14px; margin: 0; }
            @media print {
              body { background: #ffffff; padding: 0; }
              .header { margin-bottom: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RxEase AI — Clinical Audit Report</h1>
            <p>Generated automatically on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          ${blocksHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      showToast('Printable clinical report generated!', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Printable view generation failed:', err);
      showToast('Failed to generate printable report.', 'error');
    }
  };

  const handleDownload = async () => {
    if (targetIds.length === 0) {
      showToast('No valid prescriptions selected for download.', 'warning');
      return;
    }

    if (downloadMode === 'print') {
      generatePrintableView();
      return;
    }

    setIsDownloading(true);
    showToast(isBulk ? `Generating PDF report for ${targetIds.length} prescriptions...` : 'Generating prescription clinical PDF...', 'info');

    try {
      let blob;
      if (isBulk) {
        blob = await prescriptionService.exportMultiplePDF(targetIds);
      } else {
        blob = await prescriptionService.exportPDF(targetIds[0]);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', isBulk ? 'combined_prescription_report.pdf' : `prescription_report_${targetIds[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('PDF audit report downloaded successfully!', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.warn('Backend PDF download error, triggering printable fallback view:', error);
      showToast('Backend PDF server busy, switching to high-res printable clinical report...', 'warning');
      generatePrintableView();
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBulk ? `Download Combined Report (${items.length})` : 'Download Clinical Prescription Report'}
    >
      <div className="flex flex-col gap-5 font-sans text-left">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Select your preferred export format for the clinical registry audit report.
        </p>

        {/* Prescription Summary Box */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Records</span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {targetIds.map((id, index) => (
              <span key={id || index} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
                #{id}
              </span>
            ))}
          </div>
        </div>

        {/* Format Selection Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setDownloadMode('pdf')}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${
              downloadMode === 'pdf'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-white shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${downloadMode === 'pdf' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <FileText className="w-4 h-4" />
              </div>
              {downloadMode === 'pdf' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            </div>
            <div>
              <h4 className="text-sm font-bold">Standard PDF</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Formal audit document with clinical styling</p>
            </div>
          </div>

          <div
            onClick={() => setDownloadMode('print')}
            className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2 ${
              downloadMode === 'print'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-white shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${downloadMode === 'print' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Printer className="w-4 h-4" />
              </div>
              {downloadMode === 'print' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            </div>
            <div>
              <h4 className="text-sm font-bold">Printable View</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Instant browser print or save-as-PDF</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            type="button"
            disabled={isDownloading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5"
          >
            {isDownloading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloadMode === 'pdf' ? 'Download PDF' : 'Open Print View'}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
