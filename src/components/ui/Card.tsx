/**
 * Card Component
 * Flexible card container with variants for different use cases
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { tokens } from '../../tokens';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  focusable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      focusable = false,
      children,
      className = '',
      style,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const isInteractive = onClick || onKeyDown || focusable || hoverable;

    // Base styles
    const baseStyles: React.CSSProperties = {
      borderRadius: tokens.radius.card,
      overflow: 'hidden',
      backgroundColor: tokens.color.surface.default,
      transition: tokens.transition.card,
    };

    // Variant styles
    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        boxShadow: tokens.shadow[1],
        border: `1px solid ${tokens.color.border.subtle}`,
      },
      elevated: {
        boxShadow: tokens.shadow.card,
        border: 'none',
      },
      glass: {
        backgroundColor: tokens.color.glass.background,
        backdropFilter: tokens.color.glass.blur,
        WebkitBackdropFilter: tokens.color.glass.blur,
        border: `1px solid ${tokens.color.border.subtle}`,
        boxShadow: tokens.shadow.glass,
      },
      interactive: {
        boxShadow: tokens.shadow[1],
        border: `1px solid ${tokens.color.border.subtle}`,
        cursor: 'pointer',
      },
      outlined: {
        boxShadow: 'none',
        border: `1px solid ${tokens.color.border.default}`,
      },
    };

    // Padding styles
    const paddingStyles: Record<string, React.CSSProperties> = {
      none: {},
      sm: { padding: tokens.spacing.component.cardPaddingSm },
      md: { padding: tokens.spacing.component.cardPaddingMd },
      lg: { padding: tokens.spacing.component.cardPaddingLg },
    };

    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...style,
    };

    return (
      <div
        ref={ref}
        className={className}
        style={combinedStyles}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onClick}
        onKeyDown={onKeyDown}
        role={onClick ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for composition
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        padding: tokens.spacing.component.cardPaddingMd,
        paddingBottom: 0,
        borderBottom: `1px solid ${tokens.color.border.subtle}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className = '', style, ...props }, ref) => (
    <h3
      ref={ref}
      className={className}
      style={{
        ...tokens.textStyle.heading.h4,
        margin: 0,
        color: tokens.color.text.primary,
        ...style,
      }}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className = '', style, ...props }, ref) => (
    <p
      ref={ref}
      className={className}
      style={{
        ...tokens.textStyle.body.sm,
        margin: `${tokens.space.inlineSm} 0 0`,
        color: tokens.color.text.tertiary,
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        padding: tokens.spacing.component.cardPaddingMd,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', style, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.space.inline,
        padding: tokens.spacing.component.cardPaddingMd,
        paddingTop: 0,
        borderTop: `1px solid ${tokens.color.border.subtle}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';

export default Card;