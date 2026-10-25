import { typographyToCss } from './typography';

/** Design tokens: JS constants plus matching CSS custom properties on :root. */

export const colors = {
  background: '#0F172A',
  backgroundRaised: '#111827',
  surface: '#1E293B',
  surfaceHover: '#243044',
  foreground: '#F8FAFC',
  muted: '#94A3B8',
  accent: '#6366F1',
  accentHover: '#818CF8',
  accentMuted: '#312E81',
  accentForeground: '#F8FAFC',
  success: '#34D399',
  error: '#F43F5E',
  info: '#38BDF8',
  warning: '#FBBF24',
  border: '#334155',
  ring: '#6366F1',
  overlay: 'rgba(2, 6, 23, 0.72)',
} as const;

/** HSL channels (no wrapping function) so Tailwind `hsl(var(--token))` keeps working. */
export const colorChannels = {
  background: '222 47% 11%',
  foreground: '210 40% 98%',
  card: '217 33% 17%',
  cardForeground: '210 40% 98%',
  popover: '217 33% 17%',
  popoverForeground: '210 40% 98%',
  primary: '239 84% 67%',
  primaryForeground: '210 40% 98%',
  secondary: '217 33% 20%',
  secondaryForeground: '210 40% 98%',
  muted: '217 33% 20%',
  mutedForeground: '215 16% 65%',
  accent: '217 33% 22%',
  accentForeground: '210 40% 98%',
  destructive: '347 89% 61%',
  destructiveForeground: '210 40% 98%',
  border: '215 25% 27%',
  input: '215 25% 27%',
  ring: '239 84% 67%',
  heat0: '217 33% 17%',
  heat1: '243 47% 38%',
  heat2: '239 84% 67%',
  heat3: '226 100% 80%',
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;

/** Overlay elevation only — surfaces use borders, not drop shadows. */
export const shadows = {
  none: 'none',
  overlay: '0 24px 48px rgba(2, 6, 23, 0.55)',
} as const;

/** Cover strips on topic cards, keyed by category slug. */
export const categoryCovers: Record<string, string> = {
  science: '#22D3EE',
  technology: '#6366F1',
  finance: '#34D399',
  history: '#A78BFA',
  design: '#38BDF8',
};

export const fallbackCategoryCover = '#818CF8';

export function coverColorForCategory(slug: string): string {
  return categoryCovers[slug] ?? fallbackCategoryCover;
}

const STYLE_ID = 'getbetter-design-tokens';

export function cssVariableMap(): Record<string, string> {
  return {
    '--gb-color-background': colors.background,
    '--gb-color-background-raised': colors.backgroundRaised,
    '--gb-color-surface': colors.surface,
    '--gb-color-surface-hover': colors.surfaceHover,
    '--gb-color-foreground': colors.foreground,
    '--gb-color-muted': colors.muted,
    '--gb-color-accent': colors.accent,
    '--gb-color-accent-hover': colors.accentHover,
    '--gb-color-accent-muted': colors.accentMuted,
    '--gb-color-accent-foreground': colors.accentForeground,
    '--gb-color-success': colors.success,
    '--gb-color-error': colors.error,
    '--gb-color-info': colors.info,
    '--gb-color-warning': colors.warning,
    '--gb-color-border': colors.border,
    '--gb-color-ring': colors.ring,
    '--gb-color-overlay': colors.overlay,
    '--background': colorChannels.background,
    '--foreground': colorChannels.foreground,
    '--card': colorChannels.card,
    '--card-foreground': colorChannels.cardForeground,
    '--popover': colorChannels.popover,
    '--popover-foreground': colorChannels.popoverForeground,
    '--primary': colorChannels.primary,
    '--primary-foreground': colorChannels.primaryForeground,
    '--secondary': colorChannels.secondary,
    '--secondary-foreground': colorChannels.secondaryForeground,
    '--muted': colorChannels.muted,
    '--muted-foreground': colorChannels.mutedForeground,
    '--accent': colorChannels.accent,
    '--accent-foreground': colorChannels.accentForeground,
    '--destructive': colorChannels.destructive,
    '--destructive-foreground': colorChannels.destructiveForeground,
    '--border': colorChannels.border,
    '--input': colorChannels.input,
    '--ring': colorChannels.ring,
    '--heat-0': colorChannels.heat0,
    '--heat-1': colorChannels.heat1,
    '--heat-2': colorChannels.heat2,
    '--heat-3': colorChannels.heat3,
    '--radius': radius.lg,
    '--gb-radius-sm': radius.sm,
    '--gb-radius-md': radius.md,
    '--gb-radius-lg': radius.lg,
    '--gb-radius-xl': radius.xl,
    '--gb-space-1': spacing[1],
    '--gb-space-2': spacing[2],
    '--gb-space-3': spacing[3],
    '--gb-space-4': spacing[4],
    '--gb-space-5': spacing[5],
    '--gb-space-6': spacing[6],
    '--gb-space-8': spacing[8],
    '--gb-space-10': spacing[10],
    '--gb-space-12': spacing[12],
    '--gb-space-16': spacing[16],
    '--gb-shadow-none': shadows.none,
    '--gb-shadow-overlay': shadows.overlay,
    '--sidebar-width': '15.5rem',
    '--sidebar-width-collapsed': '4.25rem',
    '--navbar-height': '3.5rem',
  };
}

export function tokensToCss(): string {
  const body = Object.entries(cssVariableMap())
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return `:root {\n${body}\n}`;
}

/** Writes token custom properties onto :root so JS and CSS stay in lockstep. */
export function injectDesignTokens(): void {
  if (typeof document === 'undefined') return;
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `${tokensToCss()}\n${typographyToCss()}`;
}
