/**
 * Orbit Store Design Tokens - Border Radius, Shadows, Z-Index, Breakpoints
 */

// Border radius scale
export const radius = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
  
  // Component-specific
  button: '999px',        // Pill shape
  input: '14px',          // Matches original
  card: '16px',
  modal: '24px',
  popover: '16px',
  tooltip: '8px',
  tile: '12px',
  tileImage: '8px',
  progress: '9999px',
  avatar: '50%',
} as const;

// Box shadows
export const shadow = {
  // Elevation levels
  0: 'none',
  1: '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 1px rgba(0, 0, 0, 0.2)',
  2: '0 4px 6px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.25)',
  3: '0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.3)',
  4: '0 20px 25px rgba(0, 0, 0, 0.45), 0 10px 10px rgba(0, 0, 0, 0.35)',
  5: '0 30px 60px rgba(0, 0, 0, 0.5), 0 15px 20px rgba(0, 0, 0, 0.4)',
  
  // Specific shadows
  focus: '0 0 0 3px #ffffff, 0 0 28px 4px rgba(255, 255, 255, 0.45)',
  focusSubtle: '0 0 0 2px rgba(255, 255, 255, 0.6)',
  
  // Component shadows
  card: '0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
  cardHover: '0 8px 30px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4)',
  cardFocus: '0 0 0 3px #ffffff, 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 28px 4px rgba(255, 255, 255, 0.45)',
  
  modal: '0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px rgba(255, 255, 255, 0.07), 0 30px 70px -20px rgba(0, 0, 0, 0.75), 0 6px 18px rgba(0, 0, 0, 0.35)',
  popover: '0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 40px rgba(0, 0, 0, 0.5)',
  dropdown: '0 10px 25px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.3)',
  tooltip: '0 4px 12px rgba(0, 0, 0, 0.5)',
  
  // Inner shadows
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  insetSm: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
  insetLg: 'inset 0 4px 8px rgba(0, 0, 0, 0.4)',
  
  // Field/input
  field: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  fieldFocus: '0 0 0 2px rgba(255, 255, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  
  // Glass morphism
  glass: '0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
} as const;

// Z-index scale
export const zIndex = {
  // Base layers
  base: 0,
  below: -1,
  
  // Layout
  header: 100,
  footer: 100,
  sidebar: 200,
  overlay: 300,
  
  // Components
  dropdown: 400,
  tooltip: 500,
  popover: 600,
  modal: 700,
  modalOverlay: 650,
  
  // Special
  toast: 800,
  toastContainer: 750,
  
  // Focus (highest for accessibility)
  focus: 900,
  
  // Dev tools
  debug: 9999,
} as const;

// Breakpoints (for responsive design)
export const breakpoint = {
  // Mobile first
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  
  // TV-specific
  tv: '1920px',
  tv4k: '3840px',
  
  // Orientation
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // Pointer precision
  coarse: '(pointer: coarse)',      // Touch/gamepad
  fine: '(pointer: fine)',          // Mouse
  
  // Hover capability
  hover: '(hover: hover)',
  noHover: '(hover: none)',
  
  // Reduced motion
  reduceMotion: '(prefers-reduced-motion: reduce)',
  noReduceMotion: '(prefers-reduced-motion: no-preference)',
  
  // High contrast
  highContrast: '(prefers-contrast: more)',
  forcedColors: '(forced-colors: active)',
  
  // Color scheme
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
} as const;

// Media query helpers
export const mediaQuery = {
  // Viewport width
  up: (bp: keyof typeof breakpoint) => `@media (min-width: ${breakpoint[bp]})`,
  down: (bp: keyof typeof breakpoint) => `@media (max-width: ${parseInt(breakpoint[bp]) - 1}px)`,
  between: (min: keyof typeof breakpoint, max: keyof typeof breakpoint) => 
    `@media (min-width: ${breakpoint[min]}) and (max-width: ${parseInt(breakpoint[max]) - 1}px)`,
  
  // Pointer/hover
  pointerCoarse: `@media ${breakpoint.coarse}`,
  pointerFine: `@media ${breakpoint.fine}`,
  hover: `@media ${breakpoint.hover}`,
  noHover: `@media ${breakpoint.noHover}`,
  
  // Accessibility
  reduceMotion: `@media ${breakpoint.reduceMotion}`,
  highContrast: `@media ${breakpoint.highContrast}`,
  forcedColors: `@media ${breakpoint.forcedColors}`,
  
  // Color scheme
  dark: `@media ${breakpoint.dark}`,
  light: `@media ${breakpoint.light}`,
  
  // Orientation
  portrait: `@media ${breakpoint.portrait}`,
  landscape: `@media ${breakpoint.landscape}`,
  
  // TV-specific
  tv: `@media (min-width: ${breakpoint.tv})`,
  tv4k: `@media (min-width: ${breakpoint.tv4k})`,
} as const;

// Container queries (for component-level responsiveness)
export const containerQuery = {
  // Size-based
  xs: '@container (min-width: 320px)',
  sm: '@container (min-width: 480px)',
  md: '@container (min-width: 640px)',
  lg: '@container (min-width: 800px)',
  xl: '@container (min-width: 1024px)',
  
  // Aspect ratio
  square: '@container (aspect-ratio: 1/1)',
  landscape: '@container (aspect-ratio > 1/1)',
  portrait: '@container (aspect-ratio < 1/1)',
} as const;

export type RadiusTokens = typeof radius;
export type ShadowTokens = typeof shadow;
export type ZIndexTokens = typeof zIndex;
export type BreakpointTokens = typeof breakpoint;