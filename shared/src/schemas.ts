import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid email address' }));

export const registerSchema = z.object({
  email,
  // bcrypt only uses the first 72 bytes of a password.
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(72, { error: 'Password must be at most 72 characters' }),
  displayName: z
    .string()
    .trim()
    .min(1, { error: 'Display name is required' })
    .max(50, { error: 'Display name must be at most 50 characters' }),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
