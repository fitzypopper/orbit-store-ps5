/**
 * Button Component
 * Base button with variants, sizes, and states
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { tokens } from '../../tokens';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  focusRing?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      focusRing = true,
      disabled,
      children,
      className = '',
      style,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    
    // Base styles
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.space.inline,
      border: 'none',
      borderRadius: tokens.radius.button,
      fontFamily: tokens.fontFamily.ui,
      fontWeight: tokens.fontWeight.medium,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: tokens.transition.button,
      whiteSpace: 'nowrap',
      width: fullWidth ? '100%' : 'auto',
      opacity: isDisabled ? 0.4 : 1,
      pointerEvents: isDisabled ? 'none' : 'auto',
    };

    // Size variants
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: `${tokens.spacing.component.buttonPaddingYSm} ${tokens.spacing.component.buttonPaddingXSm}`,
        fontSize: tokens.fontSize.ui.sm,
        minHeight: '36px',
      },
      md: {
        padding: `${tokens.spacing.component.buttonPaddingY} ${tokens.spacing.component.buttonPaddingX}`,
        fontSize: tokens.fontSize.ui.md,
        minHeight: '44px',
        minWidth: '11rem',
      },
      lg: {
        padding: `${tokens.spacing.component.buttonPaddingYLg} ${tokens.spacing.component.buttonPaddingXLg}`,
        fontSize: tokens.fontSize.ui.lg,
        minHeight: '52px',
      },
      icon: {
        padding: tokens.spacing.component.buttonPaddingY,
        minWidth: '44px',
        minHeight: '44px',
      },
    };

    // Variant styles
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: tokens.color.action.primary,
        color: tokens.color.action.primaryText,
      },
      secondary: {
        backgroundColor: tokens.color.action.secondary,
        color: tokens.color.action.secondaryText,
      },
      danger: {
        backgroundColor: tokens.color.action.danger,
        color: tokens.color.action.dangerText,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: tokens.color.action.ghostText,
      },
      outline: {
        backgroundColor: 'transparent',
        color: tokens.color.text.primary,
        border: `1px solid ${tokens.color.border.default}`,
      },
    };

    // Hover/focus states (applied via CSS-in-JS or className)
    const interactiveStyles: React.CSSProperties = {};

    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...interactiveStyles,
      ...style,
    };

    // Focus ring for keyboard/gamepad navigation
    const focusStyles: React.CSSProperties = focusRing
      ? {
          outline: 'none',
        }
      : {};

    return (
      <button
        ref={ref}
        className={className}
        style={{
          ...combinedStyles,
          ...focusStyles,
        }}
        disabled={isDisabled}
        onClick={onClick}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <Spinner size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} />
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Spinner sub-component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

function Spinner({ size = 'md' }: SpinnerProps) {
  const sizeMap = {
    sm: '16px',
    md: '20px',
    lg: '24px',
  };

  return (
    <svg
      width={sizeMap[size]}
      height={sizeMap[size]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: tokens.animation.spin,
        color: 'currentColor',
      }}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        style={{
          strokeDashoffset: '0',
        }}
      />
    </svg>
  );
}

export default Button;