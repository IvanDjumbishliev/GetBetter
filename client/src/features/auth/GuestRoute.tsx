import { Navigate, Outlet, useLocation, type Location } from 'react-router';

import { FullPageLoader } from '@/components/FullPageLoader';
import { useAuth } from './useAuth';

/** For /login and /register: signed-in users go back to where they came from, else the dashboard. */
export function GuestRoute() {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isInitializing = useAuth((s) => s.isInitializing);
  const location = useLocation();

  if (isInitializing) return <FullPageLoader />;
  if (isAuthenticated) {
    const from = (location.state as { from?: Location } | null)?.from;
    return <Navigate to={from ? `${from.pathname}${from.search}` : '/dashboard'} replace />;
  }
  return <Outlet />;
}
