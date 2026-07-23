import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Clipboard, Check, Share2, Mail, ExternalLink } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { shareService } from '../../../services/shareService';
import { useAppStore } from '../../../store/useAppStore';
import { getFriendlyErrorMessage } from '../../../utils/errorMessages';

export default function ShareModal({
  isOpen,
  onClose,
  prescription, // Prescription object { id/prescriptionId, ... } or ID string or array of IDs
  onSuccess
}) {
  const showToast = useAppStore((state) => state.showToast);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [generatedShareToken, setGeneratedShareToken] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setRecipientEmail('');
      setGeneratedShareToken(null);
      setShareLinkCopied(false);
    }
  }, [isOpen]);

  const getTargetId = () => {
    if (!prescription) return null;
    if (typeof prescription === 'string') return prescription;
    if (Array.isArray(prescription)) {
      const first = prescription[0];
      return typeof first === 'object' ? (first.id || first.prescription_id || first.prescriptionId) : first;
    }
    return prescription.id || prescription.prescription_id || prescription.prescriptionId || null;
  };

  const targetId = getTargetId();

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!targetId) {
      showToast('No valid prescription ID selected for sharing.', 'warning');
      return;
    }
    if (!recipientEmail) {
      showToast('Please enter a valid recipient email address.', 'warning');
      return;
    }

    setIsSharing(true);
    try {
      const result = await shareService.sharePrescription(targetId, recipientEmail);
      const token = result.share_token || result.token || (typeof result === 'string' ? result : null);
      
      showToast(`Prescription report emailed to ${recipientEmail} successfully!`, 'success');
      setGeneratedShareToken(token || targetId);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Share prescription error:', error);
      const friendlyMsg = getFriendlyErrorMessage(error, 'Failed to share prescription.');
      showToast(friendlyMsg, 'error');
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  const publicLink = generatedShareToken
    ? `${import.meta.env.VITE_API_URL || window.location.origin}/api/v1/share/share/${generatedShareToken}`
    : '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Clinical Prescription Report"
    >
      {!generatedShareToken ? (
        <form onSubmit={handleShareSubmit} className="flex flex-col gap-4 font-sans text-left">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We will generate a secure clinical access token and email the medical audit details (including the full PDF report) directly to the recipient address below.
          </p>

          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Prescription ID</span>
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">#{targetId || 'UNKNOWN'}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Recipient Email Address</span>
            </label>
            <input
              type="email"
              placeholder="user@rxeaseai.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500 text-sm transition-colors"
            />
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              type="button"
              disabled={isSharing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSharing}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5"
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
        <div className="flex flex-col gap-4 text-left font-sans animate-in fade-in duration-200">
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2.5 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Secure sharing record established and emailed to {recipientEmail}!</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public Clinical Share Link</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-mono truncate select-all bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800 flex-1">
                {publicLink}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(publicLink);
                  setShareLinkCopied(true);
                  showToast('Share link copied to clipboard!', 'success');
                  setTimeout(() => setShareLinkCopied(false), 2000);
                }}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1 text-xs font-semibold"
              >
                {shareLinkCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                <span>{shareLinkCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Anyone possessing this secure link can retrieve and review the extracted clinical prescription items and safety audit directly from the database.
          </p>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setGeneratedShareToken(null);
                setRecipientEmail('');
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline border-0 bg-transparent cursor-pointer"
            >
              Share with another email
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-6"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
