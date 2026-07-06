import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Pill } from 'lucide-react';

export default function AutocompleteSuggestion({ showSuggestions, suggestions, onSuggestionClick }) {
  return (
    <AnimatePresence>
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.99 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute left-0 right-0 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto"
        >
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/60 m-0 p-0 text-left">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-4 py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-205 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer transition-all flex items-center gap-3 group"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <span className="flex-1 truncate group-hover:text-primary transition-colors">{suggestion}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all font-bold">Select suggestion</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
