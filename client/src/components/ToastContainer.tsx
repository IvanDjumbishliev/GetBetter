import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

import { type ToastVariant, useToastStore } from '@/stores/toast';
import { cn } from '@/lib/utils';

const ICONS: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TONE: Record<ToastVariant, string> = {
  success: 'border-emerald-400/40 text-emerald-200',
  error: 'border-rose-400/40 text-rose-200',
  info: 'border-sky-400/40 text-sky-200',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(100%-2rem,22rem)] flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((item) => {
        const Icon = ICONS[item.variant];
        return (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 border bg-card px-3 py-2.5 text-sm shadow-[var(--gb-shadow-overlay)]',
              TONE[item.variant],
            )}
          >
            <Icon aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1 text-foreground">{item.message}</p>
            <button
              type="button"
              className="rounded-sm text-muted-foreground hover:text-foreground"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
