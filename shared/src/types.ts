import type { ErrorCode } from './constants';

export interface HealthResponse {
  status: 'ok';
  message: string;
  database: 'up' | 'down';
  timestamp: string;
}

export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    details?: { path: string; message: string }[];
  };
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}
