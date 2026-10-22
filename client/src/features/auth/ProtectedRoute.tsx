import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { FullPageLoader } from '@/components/FullPageLoader';
import { useAuth } from './useAuth';

/** Renders its children (or nested routes) only for signed-in users; otherwise redirects to /login. */
export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isInitializing = useAuth((s) => s.isInitializing);
  const location = useLocation();

  if (isInitializing) return <FullPageLoader />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children ?? <Outlet />;
}
