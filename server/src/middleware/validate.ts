import { ERROR_CODES } from '@shared/constants';
import type { RequestHandler } from 'express';
import { z, type ZodType } from 'zod';
import { AppError } from '../lib/errors';

export const emptyBodySchema = z.object({}).strict();

/** Parses `input` with `schema`, throwing a VALIDATION_ERROR AppError on failure. */
export function parseOrThrow<T extends ZodType>(schema: T, input: unknown): z.output<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    throw new AppError(
      400,
      ERROR_CODES.VALIDATION_ERROR,
      details.map((d) => d.message).join('; '),
      details,
    );
  }
  return result.data;
}

/** Validates and replaces req.body with the parsed (trimmed, normalized) value. */
export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    req.body = parseOrThrow(schema, req.body ?? {});
    next();
  };
}

/** req.query is read-only in Express 5, so query parsing returns the value instead. */
export const validateQuery = parseOrThrow;
