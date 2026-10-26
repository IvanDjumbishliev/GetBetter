import type { RequestHandler } from 'express';

export function catchAsync<P = Record<string, string>>(
  handler: RequestHandler<P>,
): RequestHandler<P> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
