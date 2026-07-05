import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  const isTextarea = type === 'textarea';
  const Element = isTextarea ? 'textarea' : 'input';

  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <Element
        ref={ref}
        type={isTextarea ? undefined : type}
        className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-3 py-2.5 text-xs outline-none transition-all text-slate-800 dark:text-white ${
          error
            ? 'border-rose-500 ring-2 ring-rose-500/20'
            : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[10px] text-rose-500 font-semibold mt-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
