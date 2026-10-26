import { ERROR_CODES } from '@shared/constants';
import type { ApiErrorBody } from '@shared/types';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { env } from '../config/env';
import { AppError } from '../lib/errors';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, ERROR_CODES.NOT_FOUND, `Route ${req.method} ${req.path} not found`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let body: ApiErrorBody;
  let status: number;

  console.error('Request failed:', err);

  if (err instanceof AppError) {
    status = err.statusCode;
    body = { error: { code: err.code, message: err.message, details: err.details } };
  } else if (err?.type === 'entity.parse.failed') {
    // Thrown by express.json() for malformed request bodies.
    status = 400;
    body = { error: { code: ERROR_CODES.INVALID_JSON, message: 'Request body is not valid JSON' } };
  } else {
    status = 500;
    body = { error: { code: ERROR_CODES.INTERNAL_ERROR, message: 'Something went wrong' } };
  }

  if (env.NODE_ENV === 'development' && err instanceof Error) {
    body.error.stack = err.stack;
  }
  res.status(status).json(body);
};
