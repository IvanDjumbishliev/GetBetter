export const fontFamilies = {
  sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
  display: '"DM Serif Display", ui-serif, Georgia, serif',
} as const;

export const typeScale = {
  xs: { fontSize: '0.75rem', lineHeight: '1rem', letterSpacing: '0.01em' },
  sm: { fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0' },
  base: { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '0' },
  lg: { fontSize: '1.125rem', lineHeight: '1.75rem', letterSpacing: '-0.01em' },
  xl: { fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: '-0.015em' },
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem', letterSpacing: '-0.02em' },
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem', letterSpacing: '-0.02em' },
  '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem', letterSpacing: '-0.025em' },
} as const;

export type TypeSize = keyof typeof typeScale;

export function typographyToCss(): string {
  const vars = [
    `  --font-sans: ${fontFamilies.sans};`,
    `  --font-display: ${fontFamilies.display};`,
    ...Object.entries(typeScale).flatMap(([size, spec]) => [
      `  --text-${size}: ${spec.fontSize};`,
      `  --leading-${size}: ${spec.lineHeight};`,
      `  --tracking-${size}: ${spec.letterSpacing};`,
    ]),
  ].join('\n');
  return `:root {\n${vars}\n}`;
}
