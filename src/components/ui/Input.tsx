/**
 * Input Components
 * Text input, select, textarea with consistent styling
 */

import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { tokens } from '../../tokens';

// Shared input styles
const inputBaseStyles: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  fontFamily: tokens.fontFamily.sans,
  fontSize: tokens.fontSize.ui.md,
  lineHeight: tokens.lineHeight.ui.normal,
  color: tokens.color.text.primary,
  backgroundColor: tokens.color.field.background,
  border: 'none',
  borderRadius: tokens.radius.input,
  boxShadow: tokens.color.field.border,
  padding: `${tokens.spacing.component.inputPaddingY} ${tokens.spacing.component.inputPaddingX}`,
  transition: tokens.transition.input,
  outline: 'none',
};

const inputFocusStyles: React.CSSProperties = {
  backgroundColor: tokens.color.field.backgroundFocus,
  boxShadow: tokens.color.field.borderFocus,
};

const inputHoverStyles: React.CSSProperties = {
  backgroundColor: tokens.color.field.backgroundHover,
};

const inputDisabledStyles: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

// Text Input
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      required,
      id,
      className = '',
      style,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    const isFocused = false; // Would need state for true focus tracking

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto', display: 'flex', flexDirection: 'column', gap: tokens.space.inlineSm }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              ...tokens.textStyle.ui.label,
              color: tokens.color.text.secondary,
            }}
          >
            {label}
            {required && <span style={{ color: tokens.color.status.error, marginLeft: tokens.space.inlineSm }}>*</span>}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {leftIcon && (
            <div
              style={{
                position: 'absolute',
                left: tokens.spacing.component.inputPaddingX,
                color: tokens.color.text.quaternary,
                pointerEvents: 'none',
                zIndex: 1,
              }}
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={`${errorId || ''} ${hintId || ''}`.trim() || undefined}
            className={className}
            style={{
              ...inputBaseStyles,
              ...(isFocused ? inputFocusStyles : {}),
              ...(disabled ? inputDisabledStyles : {}),
              paddingLeft: leftIcon ? '44px' : tokens.spacing.component.inputPaddingX,
              paddingRight: rightIcon ? '44px' : tokens.spacing.component.inputPaddingX,
              ...style,
            }}
            {...props}
          />
          {rightIcon && (
            <div
              style={{
                position: 'absolute',
                right: tokens.spacing.component.inputPaddingX,
                color: tokens.color.text.quaternary,
                pointerEvents: 'none',
                zIndex: 1,
              }}
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            style={{
              ...tokens.textStyle.caption.sm,
              color: tokens.color.status.error,
              margin: 0,
            }}
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={hintId}
            style={{
              ...tokens.textStyle.caption.sm,
              color: tokens.color.text.quaternary,
              margin: 0,
            }}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Select
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      placeholder,
      options,
      fullWidth = true,
      disabled,
      required,
      id,
      className = '',
      style,
      ...props
    },
    ref,
  ) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const hintId = hint ? `${selectId}-hint` : undefined;

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto', display: 'flex', flexDirection: 'column', gap: tokens.space.inlineSm }}>
        {label && (
          <label
            htmlFor={selectId}
            style={{
              ...tokens.textStyle.ui.label,
              color: tokens.color.text.secondary,
            }}
          >
            {label}
            {required && <span style={{ color: tokens.color.status.error, marginLeft: tokens.space.inlineSm }}>*</span>}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={`${errorId || ''} ${hintId || ''}`.trim() || undefined}
            className={className}
            style={{
              ...inputBaseStyles,
              ...(disabled ? inputDisabledStyles : {}),
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a1a1a1' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `right ${tokens.spacing.component.inputPaddingX} center`,
              paddingRight: `calc(${tokens.spacing.component.inputPaddingX} + 28px)`,
              cursor: disabled ? 'not-allowed' : 'pointer',
              ...style,
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled selected hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            style={{
              ...tokens.textStyle.caption.sm,
              color: tokens.color.status.error,
              margin: 0,
            }}
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={hintId}
            style={{
              ...tokens.textStyle.caption.sm,
              color: tokens.color.text.quaternary,
              margin: 0,
            }}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

// Textarea
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  minRows?: number;
  maxRows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = true,
      minRows = 3,
      maxRows = 10,
      disabled,
      required,
      id,
      className = '',
      style,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;

    return (
      <div style={{ width: fullWidth ? '100%' : 'auto', display: 'flex', flexDirection: 'column', gap: tokens.space.inlineSm }}>
        {label && (
          <label
            htmlFor={textareaId}
            style={{
              ...tokens.textStyle.ui.label,
              color: tokens.color.text.secondary,
            }}
          >
            {label}
            {required && <span style={{ color: tokens.color.status.error, marginLeft: tokens.space.inlineSm }}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={`${errorId || ''} ${hintId || ''}`.trim() || undefined}
          className={className}
          style={{
            ...inputBaseStyles,
            ...(disabled ? inputDisabledStyles : {}),
            minHeight: `${minRows * 2.5}rem`,
            maxHeight: `${maxRows * 2.5}rem`,
            resize: 'vertical',
            fontFamily: tokens.fontFamily.sans,
            lineHeight: tokens.lineHeight.ui.normal,
            ...style,
          }}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            style={{
              ...tokens.textStyle.caption.sm,
              color: tokens.color.status.error,
              margin: 0,
            }}
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={hintId}
            style={{
              ...tokens.textStyle.caption.sm,
              color: tokens.color.text.quaternary,
              margin: 0,
            }}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export default Input;