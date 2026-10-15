/**
 * Badge Component
 * Small status/label chip with semantic colors
 */

import type { CSSProperties, ReactNode } from 'react';
import { tokens } from '../../tokens';

export interface BadgeProps {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'outline'
    | 'platform';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  style,
}: BadgeProps) {
  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: '2px 6px',
      fontSize: tokens.fontSize.caption.xs,
    },
    md: {
      padding: '4px 10px',
      fontSize: tokens.fontSize.caption.sm,
    },
  };

  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: tokens.color.text.secondary,
    },
    success: {
      backgroundColor: tokens.color.status.successBg,
      color: tokens.color.status.successText,
    },
    warning: {
      backgroundColor: tokens.color.status.warningBg,
      color: tokens.color.status.warningText,
    },
    error: {
      backgroundColor: tokens.color.status.errorBg,
      color: tokens.color.status.errorText,
    },
    info: {
      backgroundColor: tokens.color.status.infoBg,
      color: tokens.color.status.infoText,
    },
    outline: {
      backgroundColor: 'transparent',
      color: tokens.color.text.secondary,
      border: `1px solid ${tokens.color.border.default}`,
    },
    platform: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      color: tokens.color.text.primary,
      fontWeight: tokens.fontWeight.semiBold,
      letterSpacing: tokens.letterSpacing.uppercase,
      textTransform: 'uppercase',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dot ? tokens.space.inlineSm : 0,
        borderRadius: tokens.radius.full,
        fontWeight: tokens.fontWeight.medium,
        lineHeight: tokens.lineHeight.ui.tight,
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

/**
 * Platform badge: shows PS4/PS5 with consistent styling.
 */
export function PlatformBadge({ platform }: { platform: 'ps4' | 'ps5' }) {
  return (
    <Badge variant="platform" size="sm">
      {platform === 'ps4' ? 'PS4' : 'PS5'}
    </Badge>
  );
}

/**
 * Status badge for download jobs: maps a status string to a color.
 */
const statusVariantMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  complete: 'success',
  finished: 'success',
  extracting: 'warning',
  retrying: 'warning',
  paused: 'info',
  queued: 'default',
  downloading: 'info',
  transferring: 'info',
  verifying: 'info',
  failed: 'error',
  error: 'error',
  cancelled: 'default',
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const variant = statusVariantMap[status] ?? 'default';
  return (
    <Badge variant={variant} size="sm" dot>
      {label}
    </Badge>
  );
}

export default Badge;