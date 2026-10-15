/**
 * Orbit Store Design Tokens - Main Export
 * Unified export for all design tokens
 */

// Re-export all token modules. `spacing` and `typography` both define a
// `responsive` helper, so those two are re-exported selectively.
export * from './colors';
export * from './motion';
export * from './misc';
export {
  spacing,
  space,
  responsive as responsiveSpacing,
} from './spacing';
export {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyle,
  responsive as responsiveTypography,
} from './typography';

// Unified token object for easy consumption
import { semantic as color, highContrast } from './colors';
import { spacing, space, responsive as responsiveSpace } from './spacing';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyle,
  responsive as responsiveTypography,
} from './typography';
import { duration, easing, keyframes, transition, animation, reducedMotion, componentMotion } from './motion';
import { radius, shadow, zIndex, breakpoint, mediaQuery, containerQuery } from './misc';

export const tokens = {
  color,
  highContrast,
  spacing,
  space,
  responsiveSpace,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyle,
  responsiveTypography,
  duration,
  easing,
  keyframes,
  transition,
  animation,
  reducedMotion,
  componentMotion,
  radius,
  shadow,
  zIndex,
  breakpoint,
  mediaQuery,
  containerQuery,
} as const;

// Type for the complete token set
export type Tokens = typeof tokens;

// CSS-in-JS compatible theme object
export const theme = {
  colors: color,
  spacing,
  space,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyle,
  duration,
  easing,
  transition,
  animation,
  radius,
  shadow,
  zIndex,
  breakpoint,
} as const;

export type Theme = typeof theme;

// Utility function to get token value by path
export function getToken<T>(path: string): T | undefined {
  const keys = path.split('.');
  let current: any = tokens;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current as T;
}

// CSS variable generator
export function generateCSSVariables(prefix = 'orbit'): string {
  const lines: string[] = [];
  
  function processObject(obj: any, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = [...path, key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        processObject(value, newPath);
      } else if (typeof value === 'string' || typeof value === 'number') {
        const varName = `--${prefix}-${newPath.join('-')}`;
        lines.push(`  ${varName}: ${value};`);
      }
    }
  }
  
  processObject(color);
  processObject(spacing);
  processObject(fontSize);
  processObject(duration);
  processObject(radius);
  processObject(shadow);
  processObject(zIndex);
  
  return `:root {\n${lines.join('\n')}\n}`;
}

// Default CSS variables string
export const cssVariables = generateCSSVariables();

export default tokens;