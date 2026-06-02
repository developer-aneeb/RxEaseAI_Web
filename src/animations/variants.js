// Framer Motion Animation Variants

export const staggerContainer = (staggerChildren = 0.15, delayChildren = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const fadeInUp = (yOffset = 30, duration = 0.5) => ({
  hidden: { y: yOffset, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15, duration },
  },
});

export const fadeIn = (duration = 0.5, delay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration, ease: 'easeOut', delay },
  },
});

export const scaleIn = (scale = 0.95, duration = 0.8, delay = 0.3) => ({
  hidden: { opacity: 0, scale },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration, ease: 'easeOut', delay },
  },
});

export const slideIn = (direction = 'left', type = 'tween', delay = 0, duration = 0.5) => ({
  hidden: {
    x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
    y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
    opacity: 0,
  },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: 'easeOut',
    },
  },
});
