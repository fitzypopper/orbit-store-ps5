/**
 * Skeleton Component
 * Loading placeholder with shimmer animation
 */

import type { CSSProperties } from 'react';
import { tokens } from '../../tokens';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  /** CSS border-radius */
  radius?: string;
  /** Circle shape (ignores width/height ratio) */
  circle?: boolean;
  /** Number of stacked lines (for text blocks) */
  lines?: number;
  style?: CSSProperties;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  radius = tokens.radius.sm,
  circle = false,
  lines = 1,
  style,
  className,
}: SkeletonProps) {
  const shimmer: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: circle ? '50%' : radius,
    width: circle ? height : width,
    height,
    ...style,
  };

  // The shimmer overlay: a moving highlight, kept subtle so it reads as
  // "loading" rather than flashing.
  const shimmerOverlay: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 50%, transparent 100%)',
    backgroundSize: '200% 100%',
    animation: `${tokens.animation.shimmer}`,
    transform: 'translateX(-100%)',
  };

  if (lines > 1) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.space.inlineSm,
          width: '100%',
        }}
        aria-hidden="true"
        className={className}
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} style={{ ...shimmer, width: i === lines - 1 ? '70%' : width }}>
            <div style={shimmerOverlay} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={shimmer} aria-hidden="true" className={className}>
      <div style={shimmerOverlay} />
    </div>
  );
}

/**
 * SkeletonTile: placeholder matching a game tile's aspect (portrait poster).
 */
export function SkeletonTile({ width = '13rem' }: { width?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space.inlineSm, width }}>
      <Skeleton height="19rem" radius={tokens.radius.tileImage} />
      <Skeleton height="0.9rem" width="85%" />
      <Skeleton height="0.75rem" width="55%" />
    </div>
  );
}

/**
 * SkeletonRow: placeholder for a list row (Crossbar-style).
 */
export function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.space.stack,
        padding: tokens.space.stack,
        width: '100%',
      }}
    >
      <Skeleton height="4rem" width="6rem" radius={tokens.radius.tileImage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.space.inlineSm }}>
        <Skeleton height="1rem" width="40%" />
        <Skeleton height="0.75rem" width="25%" />
      </div>
    </div>
  );
}

export default Skeleton;