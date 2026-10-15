/**
 * Orbit Store Design Tokens - Typography System
 * Fluid type scale with clamp() for responsive scaling
 */

// Font families
export const fontFamily = {
  // System UI stack (matches original)
  sans: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(', '),
  
  // Display/heading font (serif for cinematic feel)
  display: [
    'Georgia',
    'Cambria',
    '"Times New Roman"',
    'Times',
    'serif',
  ].join(', '),
  
  // Monospace for code, IDs, technical text
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    '"SF Mono"',
    'Menlo',
    'Consolas',
    '"Liberation Mono"',
    'monospace',
  ].join(', '),
  
  // UI font for buttons, labels (same as sans but can be overridden)
  ui: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(', '),
} as const;

// Fluid font sizes using clamp(min, preferred, max)
// Preferred is viewport-based (vw) for TV scaling
export const fontSize = {
  // Display sizes (for hero, major headings)
  display: {
    xxl: 'clamp(2.5rem, 5vw, 4.5rem)',   // 40-72px
    xl: 'clamp(2rem, 4vw, 3.5rem)',       // 32-56px
    lg: 'clamp(1.75rem, 3.5vw, 2.75rem)', // 28-44px
    md: 'clamp(1.5rem, 3vw, 2.25rem)',    // 24-36px
    sm: 'clamp(1.25rem, 2.5vw, 1.75rem)', // 20-28px
  },
  
  // Heading sizes
  heading: {
    h1: 'clamp(1.75rem, 3vw, 2.5rem)',    // 28-40px
    h2: 'clamp(1.5rem, 2.5vw, 2rem)',     // 24-32px
    h3: 'clamp(1.25rem, 2vw, 1.5rem)',    // 20-24px
    h4: 'clamp(1.125rem, 1.5vw, 1.25rem)', // 18-20px
    h5: 'clamp(1rem, 1.25vw, 1.125rem)',  // 16-18px
    h6: 'clamp(0.875rem, 1vw, 1rem)',     // 14-16px
  },
  
  // Body sizes
  body: {
    xl: 'clamp(1.125rem, 1.25vw, 1.25rem)',  // 18-20px
    lg: 'clamp(1rem, 1.1vw, 1.125rem)',      // 16-18px
    md: 'clamp(0.9375rem, 1vw, 1rem)',       // 15-16px (base)
    sm: 'clamp(0.875rem, 0.9vw, 0.9375rem)', // 14-15px
    xs: 'clamp(0.8125rem, 0.8vw, 0.875rem)', // 13-14px
  },
  
  // UI sizes (buttons, labels, inputs)
  ui: {
    lg: 'clamp(1rem, 1.1vw, 1.125rem)',      // 16-18px
    md: 'clamp(0.9375rem, 1vw, 1rem)',       // 15-16px
    sm: 'clamp(0.875rem, 0.9vw, 0.9375rem)', // 14-15px
    xs: 'clamp(0.8125rem, 0.8vw, 0.875rem)', // 13-14px
  },
  
  // Caption/meta
  caption: {
    md: 'clamp(0.8125rem, 0.85vw, 0.875rem)', // 13-14px
    sm: 'clamp(0.75rem, 0.8vw, 0.8125rem)',   // 12-13px
    xs: 'clamp(0.6875rem, 0.75vw, 0.75rem)',  // 11-12px
  },
  
  // Base font size (for rem calculations)
  base: 'clamp(15px, 1.04vw, 20px)', // Matches original CSS
} as const;

// Font weights
export const fontWeight = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
} as const;

// Line heights
export const lineHeight = {
  none: 1,
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
  
  // Specific line heights for heading levels
  heading: {
    tight: 1.1,
    normal: 1.2,
  },
  
  // Body line heights
  body: {
    tight: 1.4,
    normal: 1.5,
    relaxed: 1.625,
  },
  
  // UI line heights
  ui: {
    tight: 1.25,
    normal: 1.4,
  },
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
  
  // For uppercase UI elements
  uppercase: '0.05em',
  uppercaseWide: '0.1em',
} as const;

// Text styles (composable presets)
export const textStyle = {
  // Display styles
  display: {
    xxl: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.display.xxl,
      fontWeight: fontWeight.light,
      lineHeight: lineHeight.heading.tight,
      letterSpacing: letterSpacing.tight,
    },
    xl: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.display.xl,
      fontWeight: fontWeight.light,
      lineHeight: lineHeight.heading.tight,
      letterSpacing: letterSpacing.tight,
    },
    lg: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.display.lg,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.heading.tight,
      letterSpacing: letterSpacing.normal,
    },
    md: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.display.md,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.heading.normal,
      letterSpacing: letterSpacing.normal,
    },
    sm: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.display.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.heading.normal,
      letterSpacing: letterSpacing.normal,
    },
  },
  
  // Heading styles
  heading: {
    h1: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.heading.h1,
      fontWeight: fontWeight.semiBold,
      lineHeight: lineHeight.heading.tight,
      letterSpacing: letterSpacing.tight,
    },
    h2: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.heading.h2,
      fontWeight: fontWeight.semiBold,
      lineHeight: lineHeight.heading.tight,
      letterSpacing: letterSpacing.normal,
    },
    h3: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.heading.h3,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.heading.normal,
      letterSpacing: letterSpacing.normal,
    },
    h4: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.heading.h4,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.heading.normal,
      letterSpacing: letterSpacing.normal,
    },
    h5: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.heading.h5,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.heading.normal,
      letterSpacing: letterSpacing.normal,
    },
    h6: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.heading.h6,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.heading.normal,
      letterSpacing: letterSpacing.wide,
      textTransform: 'uppercase' as const,
    },
  },
  
  // Body styles
  body: {
    xl: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.body.xl,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.relaxed,
      letterSpacing: letterSpacing.normal,
    },
    lg: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.body.lg,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.normal,
      letterSpacing: letterSpacing.normal,
    },
    md: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.body.md,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.normal,
      letterSpacing: letterSpacing.normal,
    },
    sm: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.body.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.normal,
      letterSpacing: letterSpacing.normal,
    },
    xs: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.body.xs,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.tight,
      letterSpacing: letterSpacing.normal,
    },
  },
  
  // UI styles (buttons, labels, inputs)
  ui: {
    button: {
      fontFamily: fontFamily.ui,
      fontSize: fontSize.ui.md,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.ui.normal,
      letterSpacing: letterSpacing.normal,
    },
    buttonSm: {
      fontFamily: fontFamily.ui,
      fontSize: fontSize.ui.sm,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.ui.tight,
      letterSpacing: letterSpacing.normal,
    },
    buttonLg: {
      fontFamily: fontFamily.ui,
      fontSize: fontSize.ui.lg,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.ui.normal,
      letterSpacing: letterSpacing.normal,
    },
    label: {
      fontFamily: fontFamily.ui,
      fontSize: fontSize.ui.sm,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.ui.normal,
      letterSpacing: letterSpacing.wide,
      textTransform: 'uppercase' as const,
    },
    input: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.ui.md,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.ui.normal,
      letterSpacing: letterSpacing.normal,
    },
    select: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.ui.md,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.ui.normal,
      letterSpacing: letterSpacing.normal,
    },
  },
  
  // Caption/meta styles
  caption: {
    md: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.caption.md,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.normal,
      letterSpacing: letterSpacing.normal,
    },
    sm: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.caption.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.tight,
      letterSpacing: letterSpacing.wide,
    },
    xs: {
      fontFamily: fontFamily.sans,
      fontSize: fontSize.caption.xs,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.tight,
      letterSpacing: letterSpacing.wide,
      textTransform: 'uppercase' as const,
    },
  },
  
  // Mono styles
  mono: {
    md: {
      fontFamily: fontFamily.mono,
      fontSize: fontSize.body.md,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.normal,
      letterSpacing: letterSpacing.normal,
    },
    sm: {
      fontFamily: fontFamily.mono,
      fontSize: fontSize.body.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.tight,
      letterSpacing: letterSpacing.normal,
    },
    xs: {
      fontFamily: fontFamily.mono,
      fontSize: fontSize.body.xs,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.body.tight,
      letterSpacing: letterSpacing.normal,
    },
  },
} as const;

// Responsive typography helpers
export const responsive = {
  // Fluid type scale for any custom sizes
  fluid: (min: string, max: string, viewport = '1vw') => 
    `clamp(${min}, ${viewport}, ${max})`,
  
  // Scale factor for different breakpoints
  scale: {
    mobile: 0.875,
    tablet: 1,
    desktop: 1,
    tv: 1.25,
  },
} as const;

export type FontSizeTokens = typeof fontSize;
export type FontWeightTokens = typeof fontWeight;
export type LineHeightTokens = typeof lineHeight;
export type LetterSpacingTokens = typeof letterSpacing;
export type TextStyleTokens = typeof textStyle;