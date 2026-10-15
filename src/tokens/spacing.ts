/**
 * Orbit Store Design Tokens - Spacing System
 * Consistent spacing scale based on 4px base unit
 */

// Base unit: 4px
const base = 4;

// Spacing scale (rem values for scalability)
export const spacing = {
  // Micro spacing (0-8px)
  0: '0',
  1: `${base * 1}px`,      // 4px
  2: `${base * 2}px`,      // 8px
  3: `${base * 3}px`,      // 12px
  4: `${base * 4}px`,      // 16px
  5: `${base * 5}px`,      // 20px
  6: `${base * 6}px`,      // 24px
  7: `${base * 7}px`,      // 28px
  8: `${base * 8}px`,      // 32px
  
  // Standard spacing (rem-based for responsive scaling)
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  
  // Component-specific spacing
  component: {
    // Button padding
    buttonPaddingX: '1.4rem',
    buttonPaddingY: '0.6rem',
    buttonPaddingXSm: '1rem',
    buttonPaddingYSm: '0.4rem',
    buttonPaddingXLg: '2rem',
    buttonPaddingYLg: '0.75rem',
    
    // Input padding
    inputPaddingX: '1rem',
    inputPaddingY: '0.75rem',
    
    // Card padding
    cardPaddingSm: '1rem',
    cardPaddingMd: '1.5rem',
    cardPaddingLg: '2rem',
    
    // Modal padding
    modalPadding: '2rem',
    
    // Tile/card gaps
    tileGap: '1.5rem',
    tileGapSm: '1rem',
    railGap: '2rem',
    
    // Page margins
    pageMarginX: '5.2vw',    // Gutter from original CSS
    pageMarginY: '2rem',
    
    // Section spacing
    sectionGap: '3rem',
    sectionGapSm: '1.5rem',
  },
  
  // Layout spacing
  layout: {
    headerHeight: '5.2rem',
    footerHeight: '4rem',
    sidebarWidth: '280px',
    maxContentWidth: '1400px',
  },
} as const;

// Semantic spacing aliases for common use cases
export const space = {
  // Inline element spacing
  inline: spacing[2],      // 8px
  inlineSm: spacing[1],    // 4px
  inlineLg: spacing[3],    // 12px
  
  // Stack spacing (vertical)
  stack: spacing[4],       // 16px
  stackSm: spacing[2],     // 8px
  stackLg: spacing[6],     // 24px
  stackXl: spacing[8],     // 32px
  
  // Group spacing (between related groups)
  group: spacing[6],       // 24px
  groupSm: spacing[4],     // 16px
  groupLg: spacing['2xl'], // 48px
  
  // Section spacing (major layout divisions)
  section: spacing['2xl'], // 48px
  sectionSm: spacing.xl,   // 32px
  sectionLg: spacing['3xl'], // 64px
  
  // Focus ring offset
  focusOffset: '2px',
  focusRingWidth: '3px',
} as const;

// Responsive spacing helpers
export const responsive = {
  // Container padding that scales with viewport
  containerPadding: 'clamp(1rem, 5vw, 3rem)',
  
  // Grid gaps
  gridGap: 'clamp(1rem, 2vw, 1.5rem)',
  gridGapSm: 'clamp(0.5rem, 1vw, 1rem)',
  
  // Hero section
  heroPaddingTop: 'clamp(2rem, 8vh, 6rem)',
  heroPaddingBottom: 'clamp(1.5rem, 4vh, 3rem)',
} as const;

export type SpacingTokens = typeof spacing;
export type SpaceTokens = typeof space;