import type { ErrorCode } from '@shared/constants';
import type { ApiErrorBody } from '@shared/types';
import axios from 'axios';

export function getApiError(error: unknown): ApiErrorBody['error'] | null {
  if (axios.isAxiosError<ApiErrorBody>(error) && error.response?.data?.error) {
    return error.response.data.error;
  }
  return null;
}

export function getApiErrorMessage(error: unknown): string {
  const apiError = getApiError(error);
  if (apiError) return apiError.message;
  if (axios.isAxiosError(error) && !error.response) return 'Unable to reach the server';
  return 'Something went wrong';
}

export function isApiErrorCode(error: unknown, code: ErrorCode): boolean {
  return getApiError(error)?.code === code;
}
