export default function Spinner({ size = 'md', fullPage = false, className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div
      className={`border-indigo-600 border-t-transparent rounded-full animate-spin ${sizes[size]} ${className}`}
      role="status"
      aria-label="loading"
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 dark:bg-slate-950/60 backdrop-blur-md transition-colors duration-300">
        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl glass-panel border border-slate-200/50 dark:border-slate-800/50 shadow-2xl bg-surface/20">
          {spinner}
          <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 animate-pulse">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return spinner;
}
