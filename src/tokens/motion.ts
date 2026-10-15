/**
 * Orbit Store Design Tokens - Motion System
 * Animation durations, easings, and keyframe definitions
 */

// Duration scale (in milliseconds)
export const duration = {
  instant: 0,
  fastest: 50,
  faster: 100,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 400,
  slowest: 500,
  
  // Specific durations for common patterns
  focus: 160,
  hover: 160,
  press: 80,
  transition: 200,
  modal: 250,
  toast: 300,
  skeleton: 1500,
  pageTransition: 300,
  railShift: 400,
} as const;

// Easing functions
export const easing = {
  // Standard easings
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Custom easings (matching original --ease)
  standard: 'cubic-bezier(0.2, 0.7, 0.2, 1)',      // Original --ease
  emphatic: 'cubic-bezier(0.2, 0, 0, 1)',           // For important transitions
  expressive: 'cubic-bezier(0.4, 0, 0.6, 1)',       // For playful movements
  
  // Spring-like (for focus, hover)
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springGentle: 'cubic-bezier(0.25, 1, 0.5, 1)',
  
  // For controller navigation (snappy)
  snappy: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  
  // For modal/popover
  modalIn: 'cubic-bezier(0, 0, 0.2, 1)',
  modalOut: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// Keyframe definitions
export const keyframes = {
  // Fade
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  
  // Scale
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.96)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  scaleOut: {
    from: { opacity: 1, transform: 'scale(1)' },
    to: { opacity: 0, transform: 'scale(0.96)' },
  },
  scalePress: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(0.98)' },
  },
  
  // Slide
  slideUp: {
    from: { opacity: 0, transform: 'translateY(16px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  slideDown: {
    from: { opacity: 0, transform: 'translateY(-16px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  slideLeft: {
    from: { opacity: 0, transform: 'translateX(16px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  slideRight: {
    from: { opacity: 0, transform: 'translateX(-16px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  
  // Rail shift (for Crossbar)
  railShift: {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(var(--rail-shift, 0))' },
  },
  
  // Focus ring pulse
  focusPulse: {
    '0%': { boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.6)' },
    '50%': { boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.3), 0 0 16px 4px rgba(255, 255, 255, 0.2)' },
    '100%': { boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.6)' },
  },
  
  // Skeleton shimmer
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  
  // Spin (for loading)
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  
  // Pulse (for status indicators)
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  
  // Bounce (for success states)
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-4px)' },
  },
  
  // Shake (for errors)
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
  },
} as const;

// Transition presets
export const transition = {
  // Base transitions
  none: 'none',
  all: `all ${duration.normal}ms ${easing.standard}`,
  
  // Property-specific
  opacity: `opacity ${duration.fast}ms ${easing.easeOut}`,
  transform: `transform ${duration.normal}ms ${easing.standard}`,
  color: `color ${duration.fast}ms ${easing.easeOut}`,
  background: `background-color ${duration.fast}ms ${easing.easeOut}`,
  border: `border-color ${duration.fast}ms ${easing.easeOut}`,
  boxShadow: `box-shadow ${duration.fast}ms ${easing.easeOut}`,
  width: `width ${duration.normal}ms ${easing.standard}`,
  height: `height ${duration.normal}ms ${easing.standard}`,
  
  // Component transitions
  button: `background ${duration.hover}ms ${easing.standard}, box-shadow ${duration.hover}ms ${easing.standard}, transform ${duration.press}ms ${easing.spring}`,
  input: `background ${duration.transition}ms ${easing.standard}, box-shadow ${duration.transition}ms ${easing.standard}`,
  card: `transform ${duration.normal}ms ${easing.standard}, box-shadow ${duration.normal}ms ${easing.standard}`,
  modal: `opacity ${duration.modal}ms ${easing.modalIn}, transform ${duration.modal}ms ${easing.modalIn}`,
  popover: `opacity ${duration.fast}ms ${easing.easeOut}, transform ${duration.fast}ms ${easing.easeOut}`,
  tooltip: `opacity ${duration.faster}ms ${easing.easeOut}`,
  
  // Focus
  focus: `box-shadow ${duration.focus}ms ${easing.easeOut}`,
  
  // Rail (Crossbar)
  rail: `transform ${duration.railShift}ms ${easing.standard}`,
  
  // Image loading
  image: `opacity ${duration.slow}ms ${easing.easeOut}`,
} as const;

// Animation presets (combining keyframes + duration + easing)
export const animation = {
  // Entrance
  fadeIn: `${keyframes.fadeIn} ${duration.normal}ms ${easing.easeOut}`,
  fadeInFast: `${keyframes.fadeIn} ${duration.fast}ms ${easing.easeOut}`,
  fadeInSlow: `${keyframes.fadeIn} ${duration.slow}ms ${easing.easeOut}`,
  
  scaleIn: `${keyframes.scaleIn} ${duration.normal}ms ${easing.springGentle}`,
  scaleInFast: `${keyframes.scaleIn} ${duration.fast}ms ${easing.spring}`,
  
  slideUp: `${keyframes.slideUp} ${duration.normal}ms ${easing.easeOut}`,
  slideDown: `${keyframes.slideDown} ${duration.normal}ms ${easing.easeOut}`,
  slideLeft: `${keyframes.slideLeft} ${duration.normal}ms ${easing.easeOut}`,
  slideRight: `${keyframes.slideRight} ${duration.normal}ms ${easing.easeOut}`,
  
  // Exit
  fadeOut: `${keyframes.fadeOut} ${duration.fast}ms ${easing.easeIn}`,
  scaleOut: `${keyframes.scaleOut} ${duration.fast}ms ${easing.easeIn}`,
  
  // Interactions
  press: `${keyframes.scalePress} ${duration.press}ms ${easing.spring}`,
  focusPulse: `${keyframes.focusPulse} 2s ${easing.easeInOut} infinite`,
  
  // Loading
  shimmer: `${keyframes.shimmer} ${duration.skeleton}ms ${easing.linear} infinite`,
  spin: `${keyframes.spin} ${duration.slow}ms ${easing.linear} infinite`,
  pulse: `${keyframes.pulse} ${duration.slowest}ms ${easing.easeInOut} infinite`,
  
  // Feedback
  bounce: `${keyframes.bounce} ${duration.normal}ms ${easing.spring}`,
  shake: `${keyframes.shake} ${duration.normal}ms ${easing.easeInOut}`,
  
  // Modal
  modalIn: `opacity ${duration.modal}ms ${easing.modalIn}, transform ${duration.modal}ms ${easing.modalIn}`,
  modalOut: `opacity ${duration.fast}ms ${easing.modalOut}, transform ${duration.fast}ms ${easing.modalOut}`,
  
  // Page
  pageIn: `${keyframes.fadeIn} ${duration.pageTransition}ms ${easing.easeOut}, ${keyframes.slideUp} ${duration.pageTransition}ms ${easing.easeOut}`,
  pageOut: `${keyframes.fadeOut} ${duration.fast}ms ${easing.easeIn}, ${keyframes.slideDown} ${duration.fast}ms ${easing.easeIn}`,
} as const;

// Reduced motion variants (respects prefers-reduced-motion)
export const reducedMotion = {
  // All durations become instant or very fast
  duration: {
    ...duration,
    fast: 0,
    normal: 0,
    slow: 0,
    modal: 0,
    railShift: 0,
    pageTransition: 0,
  },
  
  // Animations become instant
  animation: {
    fadeIn: 'none',
    fadeInFast: 'none',
    scaleIn: 'none',
    slideUp: 'none',
    slideDown: 'none',
    slideLeft: 'none',
    slideRight: 'none',
    fadeOut: 'none',
    scaleOut: 'none',
    press: 'none',
    focusPulse: 'none',
    shimmer: 'none',
    spin: 'none',
    pulse: 'none',
    bounce: 'none',
    shake: 'none',
    modalIn: 'none',
    modalOut: 'none',
    pageIn: 'none',
    pageOut: 'none',
  },
  
  // Transitions become instant
  transition: {
    ...transition,
    all: 'none',
    opacity: 'none',
    transform: 'none',
    color: 'none',
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    button: 'none',
    input: 'none',
    card: 'none',
    modal: 'none',
    popover: 'none',
    focus: 'none',
    rail: 'none',
    image: 'none',
  },
} as const;

// Motion configuration for specific components
export const componentMotion = {
  // Game tile
  gameTile: {
    hover: `transform ${duration.hover}ms ${easing.springGentle}, box-shadow ${duration.hover}ms ${easing.standard}`,
    focus: `box-shadow ${duration.focus}ms ${easing.easeOut}`,
    select: `transform ${duration.press}ms ${easing.spring}`,
  },
  
  // Rail (Discover/Store)
  rail: {
    scroll: `transform ${duration.railShift}ms ${easing.standard}`,
    itemFocus: `transform ${duration.fast}ms ${easing.springGentle}`,
  },
  
  // Crossbar list
  crossbar: {
    rowShift: `transform ${duration.railShift}ms ${easing.standard}`,
    rowFocus: `background ${duration.hover}ms ${easing.standard}`,
  },
  
  // Modal/Dialog
  modal: {
    overlay: `opacity ${duration.modal}ms ${easing.easeOut}`,
    content: `opacity ${duration.modal}ms ${easing.modalIn}, transform ${duration.modal}ms ${easing.modalIn}`,
  },
  
  // Toast/Notification
  toast: {
    enter: `${keyframes.slideRight} ${duration.toast}ms ${easing.springGentle}`,
    exit: `${keyframes.fadeOut} ${duration.fast}ms ${easing.easeIn}`,
  },
  
  // Download progress
  progress: {
    fill: `width ${duration.normal}ms ${easing.easeOut}`,
    pulse: `${keyframes.pulse} ${duration.slowest}ms ${easing.easeInOut} infinite`,
  },
  
  // Skeleton
  skeleton: {
    shimmer: `${keyframes.shimmer} ${duration.skeleton}ms ${easing.linear} infinite`,
  },
} as const;

export type DurationTokens = typeof duration;
export type EasingTokens = typeof easing;
export type KeyframeTokens = typeof keyframes;
export type TransitionTokens = typeof transition;
export type AnimationTokens = typeof animation;