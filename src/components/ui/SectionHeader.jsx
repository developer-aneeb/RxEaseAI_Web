import React from 'react';
import Badge from './Badge';

export default function SectionHeader({
  badgeText,
  badgeIcon,
  badgeVariant = 'primary',
  title,
  subtitle,
  align = 'center',
  className = '',
  ...props
}) {
  const isCenter = align === 'center';
  const alignClass = isCenter ? 'text-center max-w-3xl mx-auto mb-20' : 'text-left max-w-3xl mb-16';
  const subtitleAlignClass = isCenter ? 'mx-auto' : '';

  return (
    <div className={`${alignClass} ${className}`} {...props}>
      {badgeText && (
        <Badge 
          variant={badgeVariant} 
          icon={badgeIcon} 
          className="mb-4 uppercase tracking-wider text-xs px-3 py-1 bg-indigo-500/10"
        >
          {badgeText}
        </Badge>
      )}
      
      {title && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className={`text-slate-650 dark:text-slate-400 text-lg font-light leading-relaxed max-w-2xl ${subtitleAlignClass}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
