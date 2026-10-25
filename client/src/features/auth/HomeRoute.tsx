import { Navigate } from 'react-router';

import { FullPageLoader } from '@/components/FullPageLoader';
import { LandingPage } from '@/features/landing/LandingPage';
import { useAuth } from './useAuth';

/** `/` → dashboard when signed in, otherwise the public landing page. */
export function HomeRoute() {
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isInitializing = useAuth((s) => s.isInitializing);

  if (isInitializing) return <FullPageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}
