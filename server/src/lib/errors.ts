import type { ErrorCode } from '@shared/constants';
import type { ApiErrorBody } from '@shared/types';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: ApiErrorBody['error']['details'],
  ) {
    super(message);
    this.name = 'AppError';
  }
}
