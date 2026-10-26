import { getApiErrorMessage } from './api-error';

export const TOAST_EVENT = 'getbetter:toast';

export function showErrorToast(error: unknown): void {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: getApiErrorMessage(error) }));
}
