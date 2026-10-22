import type { DailyActivity } from '@shared/types';
import { useRef, useState, type KeyboardEvent } from 'react';

import { ChartTooltip } from '@/components/ChartTooltip';
import { cn } from '@/lib/utils';
import { dayOfWeek, formatLongDate, formatMonth, parseDateKey } from './dates';

const CELL = 20;
const GAP = 4; // surface gap between cells
const STEP = CELL + GAP;
const LABEL_WIDTH = 30;
const HEADER_HEIGHT = 18;

const LEVEL_CLASSES = ['fill-heat-0', 'fill-heat-1', 'fill-heat-2', 'fill-heat-3'] as const;
const LEGEND_CELL = 12;
const LEVEL_LABELS = ['0 lessons', '1 lesson', '2 lessons', '3+ lessons'];
const DAY_LABELS: [row: number, label: string][] = [
  [1, 'Mon'],
  [3, 'Wed'],
  [5, 'Fri'],
];

const levelFor = (count: number) => Math.min(count, 3);
const lessonsLabel = (count: number) => `${count} ${count === 1 ? 'lesson' : 'lessons'}`;

interface ActivityHeatmapProps {
  /** Consecutive days, oldest first, ending today. Rows are Sunday–Saturday. */
  activity: DailyActivity[];
}

export function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(activity.length - 1);
  const cellRefs = useRef<(SVGRectElement | null)[]>([]);

  const firstDow = activity[0] ? dayOfWeek(activity[0].date) : 0;
  const cells = activity.map((day, i) => {
    const slot = firstDow + i;
    return { ...day, col: Math.floor(slot / 7), row: slot % 7 };
  });
  const weekCount = cells.length ? cells.at(-1)!.col + 1 : 0;
  const width = LABEL_WIDTH + weekCount * STEP - GAP;
  const height = HEADER_HEIGHT + 7 * STEP - GAP;

  // A month label over the first column of each month, skipped if it would crowd the previous one.
  const monthLabels: { col: number; label: string }[] = [];
  for (const cell of cells) {
    const isFirstColumn = cell.col === 0 && cell.row === firstDow;
    if (parseDateKey(cell.date).getUTCDate() === 1 || isFirstColumn) {
      const last = monthLabels.at(-1);
      if (!last || cell.col - last.col >= 3) {
        monthLabels.push({ col: cell.col, label: formatMonth(cell.date) });
      } else if (!isFirstColumn) {
        monthLabels[monthLabels.length - 1] = { col: cell.col, label: formatMonth(cell.date) };
      }
    }
  }

  const total = activity.reduce((sum, day) => sum + day.lessonsCompleted, 0);
  const activeDays = activity.filter((day) => day.lessonsCompleted > 0);
  const active = activeIndex !== null ? cells[activeIndex] : undefined;

  // Roving focus: one tab stop for the grid; arrows move by day (up/down) or week (left/right).
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    const delta = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    const next = Math.min(Math.max(focusIndex + delta, 0), cells.length - 1);
    setFocusIndex(next);
    cellRefs.current[next]?.focus();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {lessonsLabel(total)} in the last {weekCount} weeks
      </p>

      <div className="overflow-x-auto">
        <div className="relative w-fit">
          <svg
            width={width}
            height={height}
            role="group"
            aria-label={`Lesson activity for the last ${weekCount} weeks`}
            className="block"
          >
            {monthLabels.map(({ col, label }) => (
              <text
                key={`${col}-${label}`}
                x={LABEL_WIDTH + col * STEP}
                y={11}
                className="fill-muted-foreground text-[11px]"
              >
                {label}
              </text>
            ))}
            {DAY_LABELS.map(([row, label]) => (
              <text
                key={label}
                x={0}
                y={HEADER_HEIGHT + row * STEP + CELL / 2 + 4}
                className="fill-muted-foreground text-[11px]"
              >
                {label}
              </text>
            ))}
            <g onKeyDown={onKeyDown} onPointerLeave={() => setActiveIndex(null)}>
              {cells.map((cell, i) => (
                <rect
                  key={cell.date}
                  ref={(el) => {
                    cellRefs.current[i] = el;
                  }}
                  x={LABEL_WIDTH + cell.col * STEP}
                  y={HEADER_HEIGHT + cell.row * STEP}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  tabIndex={i === focusIndex ? 0 : -1}
                  aria-label={`${lessonsLabel(cell.lessonsCompleted)} on ${formatLongDate(cell.date)}`}
                  className={cn(LEVEL_CLASSES[levelFor(cell.lessonsCompleted)], 'outline-none')}
                  onPointerEnter={() => setActiveIndex(i)}
                  onFocus={() => {
                    setFocusIndex(i);
                    setActiveIndex(i);
                  }}
                  onBlur={() => setActiveIndex(null)}
                />
              ))}
              {/* Hover/focus outline drawn just outside the cell so it reads on every level. */}
              {active && (
                <rect
                  x={LABEL_WIDTH + active.col * STEP - 2}
                  y={HEADER_HEIGHT + active.row * STEP - 2}
                  width={CELL + 4}
                  height={CELL + 4}
                  rx={5}
                  className="pointer-events-none fill-none stroke-foreground"
                  strokeWidth={1.5}
                />
              )}
            </g>
          </svg>

          {active && (
            <ChartTooltip
              x={LABEL_WIDTH + active.col * STEP + CELL / 2}
              y={HEADER_HEIGHT + active.row * STEP}
            >
              <span className="font-semibold">{lessonsLabel(active.lessonsCompleted)}</span>{' '}
              <span className="text-muted-foreground">{formatLongDate(active.date)}</span>
            </ChartTooltip>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <details className="group">
          <summary className="cursor-pointer select-none hover:text-foreground">
            View as table
          </summary>
          {activeDays.length > 0 ? (
            <table className="mt-2 text-left">
              <thead>
                <tr>
                  <th className="pr-6 font-medium">Date</th>
                  <th className="font-medium">Lessons</th>
                </tr>
              </thead>
              <tbody className="tabular-nums text-foreground">
                {activeDays.map((day) => (
                  <tr key={day.date}>
                    <td className="pr-6">{formatLongDate(day.date)}</td>
                    <td>{day.lessonsCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-2">No lessons completed in this period.</p>
          )}
        </details>

        <div className="flex items-center gap-1.5" aria-label="Color scale: fewer to more lessons">
          <span>Less</span>
          <svg width={4 * (LEGEND_CELL + GAP) - GAP} height={LEGEND_CELL} aria-hidden>
            {LEVEL_CLASSES.map((cls, level) => (
              <rect
                key={cls}
                x={level * (LEGEND_CELL + GAP)}
                width={LEGEND_CELL}
                height={LEGEND_CELL}
                rx={2}
                className={cls}
              >
                <title>{LEVEL_LABELS[level]}</title>
              </rect>
            ))}
          </svg>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
