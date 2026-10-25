import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  color?: string;
  className?: string;
  label?: string;
}

export function ProgressBar({ value, color, className, label = 'Progress' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn('h-2 overflow-hidden rounded-[4px] border border-border bg-secondary', className)}
    >
      <div
        className="h-full rounded-r-[3px] transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${clamped}%`, backgroundColor: color ?? 'var(--gb-color-accent)' }}
      />
    </div>
  );
}
