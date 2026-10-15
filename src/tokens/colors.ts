/**
 * Orbit Store Design Tokens - Color System
 * Semantic color tokens for consistent theming across all interfaces
 */

// Base color primitives (never use directly in components)
export const primitive = {
  // Night scale - deep backgrounds
  night: {
    0: '#000000',   // Pure black - deepest
    1: '#080808',   // Near black - primary background
    2: '#151515',   // Elevated surface
    3: '#242424',   // Higher elevation / hover
    4: '#2d2d2d',   // Input backgrounds
    5: '#3a3a3a',   // Borders, dividers
  },

  // White scale - text and accents
  white: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Accent colors
  accent: {
    primary: '#ffffff',      // Primary action
    primaryHover: '#e0e0e0', // Primary hover
    primaryText: '#080808',  // Text on primary
    
    success: '#4ade80',      // Green
    successHover: '#22c55e',
    successBg: 'rgba(74, 222, 128, 0.1)',
    
    warning: '#fbbf24',      // Amber
    warningHover: '#f59e0b',
    warningBg: 'rgba(251, 191, 36, 0.1)',
    
    danger: '#f87171',       // Red
    dangerHover: '#ef4444',
    dangerBg: 'rgba(248, 113, 113, 0.1)',
    
    info: '#60a5fa',         // Blue
    infoHover: '#3b82f6',
    infoBg: 'rgba(96, 165, 250, 0.1)',
  },

  // Focus ring
  focus: {
    ring: '0 0 0 2px #ffffff',
    ringOffset: '0 0 0 4px rgba(255, 255, 255, 0.4)',
  },

  // Glass morphism
  glass: {
    light: 'rgba(8, 8, 8, 0.62)',
    lightHover: 'rgba(20, 20, 20, 0.74)',
    lightActive: 'rgba(32, 32, 32, 0.82)',
    blur: 'blur(18px) saturate(1.3)',
  },
} as const;

// Semantic color tokens (use these in components)
export const semantic = {
  // Background layers
  background: {
    primary: primitive.night[1],      // Main app background
    secondary: primitive.night[2],    // Cards, panels
    tertiary: primitive.night[3],     // Elevated, hover states
    inverse: primitive.white[50],     // For light mode (future)
  },

  // Surface variants
  surface: {
    default: primitive.night[2],
    hover: primitive.night[3],
    active: primitive.night[4],
    disabled: primitive.night[1],
  },

  // Border colors
  border: {
    default: 'rgba(255, 255, 255, 0.16)',
    subtle: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.24)',
    focus: primitive.white[100],
    error: primitive.accent.danger,
    success: primitive.accent.success,
  },

  // Text colors
  text: {
    primary: primitive.white[100],    // Main headings
    secondary: '#d0d0d0',             // Body text
    tertiary: '#a1a1a1',              // Captions, metadata
    quaternary: '#737373',            // Disabled, placeholders
    inverse: primitive.night[0],      // Text on light backgrounds
    link: primitive.accent.info,
    linkHover: primitive.accent.infoHover,
  },

  // Action colors
  action: {
    primary: primitive.accent.primary,
    primaryHover: primitive.accent.primaryHover,
    primaryText: primitive.accent.primaryText,
    primaryDisabled: 'rgba(255, 255, 255, 0.4)',
    
    secondary: 'rgba(255, 255, 255, 0.1)',
    secondaryHover: 'rgba(255, 255, 255, 0.18)',
    secondaryText: primitive.white[100],
    
    danger: primitive.accent.danger,
    dangerHover: primitive.accent.dangerHover,
    dangerText: primitive.white[100],
    
    ghost: 'transparent',
    ghostHover: 'rgba(255, 255, 255, 0.08)',
    ghostText: primitive.white[100],
  },

  // Status colors
  status: {
    success: primitive.accent.success,
    successBg: primitive.accent.successBg,
    successText: primitive.accent.success,
    
    warning: primitive.accent.warning,
    warningBg: primitive.accent.warningBg,
    warningText: primitive.accent.warning,
    
    error: primitive.accent.danger,
    errorBg: primitive.accent.dangerBg,
    errorText: primitive.accent.danger,
    
    info: primitive.accent.info,
    infoBg: primitive.accent.infoBg,
    infoText: primitive.accent.info,
    
    downloading: primitive.accent.info,
    queued: primitive.accent.warning,
    complete: primitive.accent.success,
    failed: primitive.accent.danger,
    paused: primitive.accent.info,
    extracting: primitive.accent.warning,
    transferring: primitive.accent.info,
    verifying: primitive.accent.info,
  },

  // Field/input colors
  field: {
    background: 'rgba(255, 255, 255, 0.075)',
    backgroundHover: 'rgba(255, 255, 255, 0.115)',
    backgroundFocus: 'rgba(255, 255, 255, 0.145)',
    border: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    borderFocus: '0 0 0 2px rgba(255, 255, 255, 0.6)',
    placeholder: '#a1a1a1',
  },

  // Glass surfaces (for panels over artwork)
  glass: {
    background: 'rgba(8, 8, 8, 0.62)',
    backgroundHover: 'rgba(20, 20, 20, 0.74)',
    backgroundActive: 'rgba(32, 32, 32, 0.82)',
    blur: 'blur(18px) saturate(1.3)',
  },

  // Popover/modal
  popover: {
    background: 'rgba(20, 20, 20, 0.9)',
    border: '0 0 0 1px rgba(255, 255, 255, 0.08)',
    shadow: `
      0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px rgba(255, 255, 255, 0.07),
      0 30px 70px -20px rgba(0, 0, 0, 0.75),
      0 6px 18px rgba(0, 0, 0, 0.35)
    `,
  },

  // Gradient backgrounds
  gradient: {
    appBackground: `
      radial-gradient(90% 70% at 8% 0%, #181818 0%, transparent 60%),
      linear-gradient(180deg, ${primitive.night[1]} 0%, ${primitive.night[0]} 100%)
    `,
    heroBackground: `
      radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)
    `,
  },
} as const;

// High contrast variant (for accessibility)
export const highContrast = {
  ...semantic,
  background: {
    ...semantic.background,
    primary: '#000000',
    secondary: '#1a1a1a',
    tertiary: '#333333',
  },
  border: {
    ...semantic.border,
    default: '#ffffff',
    subtle: '#cccccc',
    strong: '#ffffff',
  },
  text: {
    ...semantic.text,
    primary: '#ffffff',
    secondary: '#ffffff',
    tertiary: '#cccccc',
  },
  action: {
    ...semantic.action,
    secondary: '#333333',
    secondaryHover: '#444444',
  },
  field: {
    ...semantic.field,
    background: '#1a1a1a',
    backgroundHover: '#2a2a2a',
    backgroundFocus: '#333333',
    border: '1px solid #ffffff',
    borderFocus: '2px solid #ffffff',
  },
} as const;

export type ColorTokens = typeof semantic;
export type PrimitiveColors = typeof primitive;