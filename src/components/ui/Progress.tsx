/**
 * Progress Components
 * Linear and circular progress indicators with status colors
 */

import type { CSSProperties } from 'react';
import { tokens } from '../../tokens';

// Linear progress bar
export interface ProgressBarProps {
  /** 0..1 */
  value: number;
  max?: number;
  /** Show the percentage label */
  label?: boolean;
  /** Accessible description, e.g. "Downloading" */
  status?: string;
  color?: 'default' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  indeterminate?: boolean;
  style?: CSSProperties;
}

export function ProgressBar({
  value,
  max = 1,
  label = false,
  status,
  color = 'default',
  size = 'md',
  indeterminate = false,
  style,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value / max));
  const percent = Math.round(clamped * 100);

  const colorMap: Record<string, string> = {
    default: tokens.color.text.primary,
    info: tokens.color.status.info,
    success: tokens.color.status.success,
    warning: tokens.color.status.warning,
    error: tokens.color.status.error,
  };

  const height = size === 'sm' ? '4px' : '6px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space.inlineSm, width: '100%', ...style }}>
      {(label || status) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: tokens.space.inline,
          }}
        >
          {status && (
            <span
              style={{
                ...tokens.textStyle.caption.sm,
                color: tokens.color.text.tertiary,
                letterSpacing: tokens.letterSpacing.uppercase,
                textTransform: 'uppercase',
              }}
            >
              {status}
            </span>
          )}
          {label && (
            <span
              style={{
                ...tokens.textStyle.caption.md,
                color: tokens.color.text.secondary,
                fontVariantNumeric: 'tabular-nums',
              }}
              aria-hidden="true"
            >
              {percent}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={status}
        style={{
          position: 'relative',
          width: '100%',
          height,
          borderRadius: tokens.radius.progress,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: indeterminate ? '40%' : `${percent}%`,
            borderRadius: tokens.radius.progress,
            backgroundColor: colorMap[color],
            transition: indeterminate ? 'none' : tokens.transition.width,
            ...(indeterminate
              ? {
                  animation: `orbit-slide 1.2s ${tokens.easing.easeInOut} infinite`,
                }
              : {}),
          }}
        />
      </div>
    </div>
  );
}

// Circular progress (for compact contexts)
export interface CircularProgressProps {
  /** 0..1 */
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'default' | 'info' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
  style?: CSSProperties;
}

export function CircularProgress({
  value,
  max = 1,
  size = 32,
  strokeWidth = 3,
  color = 'default',
  indeterminate = false,
  style,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(1, value / max));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  const colorMap: Record<string, string> = {
    default: tokens.color.text.primary,
    info: tokens.color.status.info,
    success: tokens.color.status.success,
    warning: tokens.color.status.warning,
    error: tokens.color.status.error,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        transform: indeterminate ? 'rotate(-90deg)' : 'none',
        ...(indeterminate ? { animation: tokens.animation.spin } : {}),
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Value */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colorMap[color]}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
        style={{
          transition: indeterminate ? 'none' : 'stroke-dashoffset 200ms ease-out',
        }}
      />
    </svg>
  );
}

export default ProgressBar;