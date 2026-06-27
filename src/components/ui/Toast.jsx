import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const styles = {
  success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-500/10 shadow-emerald-500/5',
  error: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-500/20 dark:border-rose-500/10 shadow-rose-500/5',
  warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-500/20 dark:border-amber-500/10 shadow-amber-500/5',
  info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-500/20 dark:border-blue-500/10 shadow-blue-500/5'
};

const iconColors = {
  success: 'text-emerald-500 dark:text-emerald-400',
  error: 'text-rose-500 dark:text-rose-400',
  warning: 'text-amber-500 dark:text-amber-400',
  info: 'text-blue-500 dark:text-blue-400'
};

export default function Toast({ id, message, type = 'info', onClose }) {
  const Icon = icons[type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
      className={`flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 ${styles[type]}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColors[type]}`} />
      
      <div className="flex-1 text-sm font-medium pr-2 whitespace-pre-wrap leading-relaxed">
        {message}
      </div>

      <button
        onClick={() => onClose(id)}
        className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
