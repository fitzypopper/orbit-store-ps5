/**
 * Modal Component
 * Accessible modal dialog with animations and focus management
 */

import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { tokens } from '../../tokens';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className = '',
  style,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`);
  const descriptionId = useRef(`modal-desc-${Math.random().toString(36).slice(2)}`);

  // Focus management
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      
      // Focus the modal or first focusable element
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  // Trap focus within modal
  useEffect(() => {
    if (!open) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [open]);

  if (!open) return null;

  // Size styles
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '560px' },
    lg: { maxWidth: '720px' },
    xl: { maxWidth: '960px' },
    full: { maxWidth: '100%', width: '100%', maxHeight: '100%' },
  };

  const modalContent = (
    <div
      className={`modal-overlay ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.space[4],
        zIndex: tokens.zIndex.modalOverlay,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        animation: tokens.animation.fadeInFast,
        ...style,
      }}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="presentation"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId.current : undefined}
        aria-describedby={description ? descriptionId.current : undefined}
        style={{
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          borderRadius: tokens.radius.modal,
          backgroundColor: tokens.color.popover.background,
          boxShadow: tokens.shadow.modal,
          animation: tokens.animation.modalIn,
          display: 'flex',
          flexDirection: 'column',
          ...sizeStyles[size],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: tokens.space[4],
              padding: `${tokens.spacing.component.modalPadding} ${tokens.spacing.component.modalPadding} 0`,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && (
                <h2
                  id={titleId.current}
                  style={{
                    ...tokens.textStyle.heading.h3,
                    margin: 0,
                    color: tokens.color.text.primary,
                  }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descriptionId.current}
                  style={{
                    ...tokens.textStyle.body.md,
                    margin: `${tokens.space.inlineSm} 0 0`,
                    color: tokens.color.text.secondary,
                  }}
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  flexShrink: 0,
                  color: tokens.color.text.tertiary,
                  padding: tokens.space[2],
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            )}
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: tokens.spacing.component.modalPadding,
            paddingTop: title ? 0 : tokens.spacing.component.modalPadding,
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: tokens.space.inline,
              padding: tokens.spacing.component.modalPadding,
              borderTop: `1px solid ${tokens.color.border.subtle}`,
              marginTop: 'auto',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Portal to body for proper stacking
  return createPortal(modalContent, document.body);
}

// Confirmation modal helper
interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p style={{ ...tokens.textStyle.body.md, color: tokens.color.text.secondary, margin: 0 }}>
        {message}
      </p>
    </Modal>
  );
}

export default Modal;