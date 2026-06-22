import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  icon: Icon,
  iconPosition = 'right',
  animate = true,
  onClick,
  ...props
}) {
  // Styles based on variant
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25',
    secondary: 'glassmorphism hover:bg-slate-100 dark:hover:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white',
    accent: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10',
    glass: 'glassmorphism-light hover:bg-slate-200/50 dark:hover:bg-slate-900/50 text-slate-705 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    outline: 'border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white',
    ghost: 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/55',
    custom: '', // Allows passing full custom styles via className without base variant styles
  };

  // Styles based on size
  const sizes = {
    sm: 'px-3.5 py-2 text-xs rounded-lg font-medium',
    md: 'px-5 py-2.5 text-sm rounded-xl font-medium',
    lg: 'px-6 py-3.5 text-sm rounded-xl font-medium',
    none: '', // For buttons that define their own padding/sizing via className
  };

  const baseStyles = 'relative inline-flex items-center justify-center gap-1.5 transition-all duration-200 font-sans cursor-pointer focus:outline-none';
  const combinedClasses = `${baseStyles} ${variants[variant] !== undefined ? variants[variant] : variants.primary} ${sizes[size] !== undefined ? sizes[size] : sizes.md} ${className}`;

  const iconElement = Icon ? (
    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
      iconPosition === 'right' ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'
    }`} />
  ) : null;

  const content = (
    <span className="relative z-10 flex items-center gap-1.5">
      {Icon && iconPosition === 'left' && iconElement}
      {children}
      {Icon && iconPosition === 'right' && iconElement}
    </span>
  );

  const Component = animate ? motion.button : 'button';
  const animationProps = animate
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      }
    : {};

  if (href) {
    if (animate) {
      return (
        <motion.a
          href={href}
          className={`group ${combinedClasses}`}
          onClick={onClick}
          {...animationProps}
          {...props}
        >
          {content}
        </motion.a>
      );
    }
    return (
      <a href={href} className={`group ${combinedClasses}`} onClick={onClick} {...props}>
        {content}
      </a>
    );
  }

  return (
    <Component
      onClick={onClick}
      className={`group ${combinedClasses}`}
      {...animationProps}
      {...props}
    >
      {content}
    </Component>
  );
}
