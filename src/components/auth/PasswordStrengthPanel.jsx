export default function PasswordStrengthPanel({ password }) {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasMinLength, hasLowercase, hasUppercase, hasNumberOrSymbol].filter(Boolean).length;

  const getStrengthText = () => {
    switch (strengthScore) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Medium';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  };

  const getStrengthColorClass = () => {
    switch (strengthScore) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-indigo-500 dark:bg-indigo-400';
      case 4: return 'bg-emerald-600';
      default: return 'bg-slate-200 dark:bg-slate-800';
    }
  };

  const getStrengthTextColor = () => {
    switch (strengthScore) {
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-indigo-600 dark:text-indigo-400';
      case 4: return 'text-emerald-600 dark:text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-500/5 border border-outline-variant/10 dark:border-slate-800/50 animate-fade-in-up">
      <div className="flex justify-between items-center text-xs font-medium">
        <span className="text-on-surface-variant dark:text-slate-400">Password Strength</span>
        <span className={`${getStrengthTextColor()} font-semibold`}>{getStrengthText()}</span>
      </div>

      {/* Strength indicator 4 bars */}
      <div className="grid grid-cols-4 gap-2 h-1.5 w-full mt-0.5">
        <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 1 ? getStrengthColorClass() : 'bg-slate-200 dark:bg-slate-800'}`}></div>
        <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 2 ? getStrengthColorClass() : 'bg-slate-200 dark:bg-slate-800'}`}></div>
        <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 3 ? getStrengthColorClass() : 'bg-slate-200 dark:bg-slate-800'}`}></div>
        <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 4 ? getStrengthColorClass() : 'bg-slate-200 dark:bg-slate-800'}`}></div>
      </div>

      {/* Validation checks */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
        {/* 8+ characters */}
        <div className="flex items-center gap-2 text-[11px] font-medium transition-colors">
          {hasMinLength ? (
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
          <span className={hasMinLength ? 'text-on-surface dark:text-slate-200' : 'text-on-surface-variant dark:text-slate-400'}>8+ characters</span>
        </div>

        {/* Uppercase letter */}
        <div className="flex items-center gap-2 text-[11px] font-medium transition-colors">
          {hasUppercase ? (
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
          <span className={hasUppercase ? 'text-on-surface dark:text-slate-200' : 'text-on-surface-variant dark:text-slate-400'}>Uppercase letter</span>
        </div>

        {/* Lowercase letter */}
        <div className="flex items-center gap-2 text-[11px] font-medium transition-colors">
          {hasLowercase ? (
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
          <span className={hasLowercase ? 'text-on-surface dark:text-slate-200' : 'text-on-surface-variant dark:text-slate-400'}>Lowercase letter</span>
        </div>

        {/* Number or symbol */}
        <div className="flex items-center gap-2 text-[11px] font-medium transition-colors">
          {hasNumberOrSymbol ? (
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
          <span className={hasNumberOrSymbol ? 'text-on-surface dark:text-slate-200' : 'text-on-surface-variant dark:text-slate-400'}>Number or symbol</span>
        </div>
      </div>
    </div>
  );
}
