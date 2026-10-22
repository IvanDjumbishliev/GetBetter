import type { ReactNode } from 'react';

interface ChartTooltipProps {
  /** Anchor point in px, relative to the nearest positioned ancestor. The tooltip sits above it. */
  x: number;
  y: number;
  children: ReactNode;
}

export function ChartTooltip({ x, y, children }: ChartTooltipProps) {
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md"
      style={{ left: x, top: y - 6 }}
    >
      {children}
    </div>
  );
}
