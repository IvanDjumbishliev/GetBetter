import type { LoginInput, RegisterInput } from '@shared/schemas';
import type { AuthResponse, AuthUser } from '@shared/types';

import { http } from '@/lib/http';

export const authClient = {
  register: (input: RegisterInput) =>
    http.post<AuthResponse>('/auth/register', input).then((res) => res.data),
  login: (input: LoginInput) =>
    http.post<AuthResponse>('/auth/login', input).then((res) => res.data),
  logout: () => http.post('/auth/logout').then(() => undefined),
  refresh: () => http.post<AuthResponse>('/auth/refresh-token').then((res) => res.data),
  me: () => http.get<{ user: AuthUser }>('/auth/me').then((res) => res.data.user),
};
