/**
 * Toast Components
 * Transient status messages with a small context provider.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { tokens } from '../../tokens';
import { Button } from './Button';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  /** Optional action button */
  action?: { label: string; onClick: () => void };
  /** ms; 0 keeps it until dismissed */
  duration: number;
}

interface ToastContextValue {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = nextId++;
      setToasts((current) => [...current.slice(-3), { ...toast, id }]); // cap at 4 visible
      if (toast.duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), toast.duration),
        );
      }
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  const value = useMemo(
    () => ({ toasts, push, dismiss }),
    [toasts, push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

const variantColors: Record<ToastVariant, { bar: string; bg: string }> = {
  info: { bar: tokens.color.status.info, bg: tokens.color.popover.background },
  success: { bar: tokens.color.status.success, bg: tokens.color.popover.background },
  warning: { bar: tokens.color.status.warning, bg: tokens.color.popover.background },
  error: { bar: tokens.color.status.error, bg: tokens.color.popover.background },
};

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: tokens.spacing[8],
        right: tokens.spacing[8],
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.space.stackSm,
        zIndex: tokens.zIndex.toast,
        maxWidth: '24rem',
        width: '100%',
      }}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const colors = variantColors[toast.variant];
        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: tokens.space.inline,
              padding: `${tokens.space.stackSm} ${tokens.space.stack}`,
              borderRadius: tokens.radius.popover,
              backgroundColor: colors.bg,
              boxShadow: tokens.shadow.popover,
              borderLeft: `3px solid ${colors.bar}`,
              animation: tokens.animation.slideRight,
            }}
            role={toast.variant === 'error' ? 'alert' : 'status'}
            aria-live={toast.variant === 'error' ? 'assertive' : 'polite'}
          >
            <p
              style={{
                ...tokens.textStyle.body.sm,
                color: tokens.color.text.primary,
                flex: 1,
                margin: 0,
              }}
            >
              {toast.message}
            </p>
            {toast.action && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toast.action!.onClick();
                  onDismiss(toast.id);
                }}
              >
                {toast.action.label}
              </Button>
            )}
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              style={{
                background: 'none',
                border: 'none',
                color: tokens.color.text.quaternary,
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Convenience hook: returns helpers for the common cases.
 */
export function useToastHelpers() {
  const { push, dismiss } = useToast();
  const DURATION = 4000;
  return useMemo(
    () => ({
      info: (message: string, action?: Toast['action']) =>
        push({ message, variant: 'info', duration: DURATION, action }),
      success: (message: string) =>
        push({ message, variant: 'success', duration: DURATION }),
      warning: (message: string) =>
        push({ message, variant: 'warning', duration: DURATION }),
      error: (message: string, action?: Toast['action']) =>
        push({ message, variant: 'error', duration: 0, action }),
      dismiss,
    }),
    [push, dismiss],
  );
}

export default ToastProvider;