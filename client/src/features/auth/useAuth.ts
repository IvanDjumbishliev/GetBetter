import type { LoginInput } from '@shared/schemas';
import type { AuthResponse, AuthUser } from '@shared/types';
import axios from 'axios';
import { create } from 'zustand';

import { registerAuthHandlers } from '@/lib/http';
import { authClient } from './authClient';

interface AuthState {
  user: AuthUser | null;
  /** Kept in memory only; the refresh token lives in an httpOnly cookie. */
  accessToken: string | null;
  isAuthenticated: boolean;
  /** True until the initial session restore (via the refresh cookie) has finished. */
  isInitializing: boolean;
  setSession: (session: AuthResponse) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** Gets a new access token from the refresh cookie. Resolves to null if that fails. */
  refreshToken: () => Promise<string | null>;
  initialize: () => Promise<void>;
}

// Shared so concurrent 401s (or StrictMode's double effects) trigger a single refresh request.
let refreshInFlight: Promise<string | null> | null = null;

export const useAuth = create<AuthState>()((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setSession: ({ user, accessToken }) => set({ user, accessToken, isAuthenticated: true }),
  setUser: (user) => set({ user }),

  clearSession: () => set({ user: null, accessToken: null, isAuthenticated: false }),

  login: async (input) => {
    const session = await authClient.login(input);
    get().setSession(session);
    return session.user;
  },

  logout: async () => {
    try {
      await authClient.logout();
    } finally {
      get().clearSession();
    }
  },

  refreshToken: () => {
    refreshInFlight ??= authClient
      .refresh()
      .then((session) => {
        get().setSession(session);
        return session.accessToken;
      })
      .catch((error: unknown) => {
        // Only a rejected refresh token ends the session; network blips shouldn't log the user out.
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          get().clearSession();
        }
        return null;
      })
      .finally(() => {
        refreshInFlight = null;
      });
    return refreshInFlight;
  },

  initialize: async () => {
    if (!get().isInitializing) return;
    await get().refreshToken();
    set({ isInitializing: false });
  },
}));

registerAuthHandlers({
  getAccessToken: () => useAuth.getState().accessToken,
  refreshAccessToken: () => useAuth.getState().refreshToken(),
});
