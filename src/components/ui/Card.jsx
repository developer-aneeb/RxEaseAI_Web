import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  variant = 'glass',
  animate = false,
  hoverEffect = false,
  className = '',
  onClick,
  style,
  ...props
}) {
  const variants = {
    glass: 'glassmorphism rounded-2xl border border-slate-200 dark:border-slate-800/80',
    glassLight: 'glassmorphism-light rounded-xl border border-slate-200 dark:border-slate-800/80',
    flat: 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800',
  };

  const baseStyles = 'relative transition-all duration-300';
  
  // Add interactive/hover styles if onClick or hoverEffect is set
  const interactiveStyles = (onClick || hoverEffect) 
    ? 'cursor-pointer hover:border-indigo-500/30 dark:hover:border-indigo-500/30' 
    : 'cursor-default';

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.glass} ${interactiveStyles} ${className}`;

  // Framer Motion props
  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.5 },
        ...(hoverEffect ? { whileHover: { y: -6, scale: 1.01 } } : {}),
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={combinedClasses}
      style={style}
      {...animationProps}
      {...props}
    >
      {/* Glow highlight on hover (if variant is glass/glassLight and hoverEffect is active) */}
      {(onClick || hoverEffect) && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 hover:from-indigo-500/5 hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />
      )}
      {children}
    </Component>
  );
}
