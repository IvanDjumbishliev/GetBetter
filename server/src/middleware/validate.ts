import { ERROR_CODES } from '@shared/constants';
import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../lib/errors';

/** Validates and replaces req.body with the parsed (trimmed, normalized) value. */
export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return next(
        new AppError(
          400,
          ERROR_CODES.VALIDATION_ERROR,
          details.map((d) => d.message).join('; '),
          details,
        ),
      );
    }
    req.body = result.data;
    next();
  };
}
