import { ERROR_CODES } from '@shared/constants';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../lib/errors';
import { verifyAccessTokenString } from './authService';

export const verifyAccessToken: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : undefined;
  if (!token) {
    return next(new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Missing access token'));
  }

  try {
    const payload = verifyAccessTokenString(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (error) {
    next(
      error instanceof jwt.TokenExpiredError
        ? new AppError(401, ERROR_CODES.TOKEN_EXPIRED, 'Access token has expired')
        : new AppError(401, ERROR_CODES.INVALID_TOKEN, 'Access token is invalid'),
    );
  }
};
