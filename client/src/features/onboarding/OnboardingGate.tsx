import { lazy } from 'react';
import { Outlet } from 'react-router';

import { FullPageLoader } from '@/components/FullPageLoader';
import { useAuth } from '@/features/auth/useAuth';

const MultiStepOnboarding = lazy(() =>
  import('./MultiStepOnboarding').then((module) => ({ default: module.MultiStepOnboarding })),
);

export function OnboardingGate() {
  const user = useAuth((state) => state.user);
  if (!user) return <FullPageLoader />;
  if (!user.onboardingCompletedAt) return <MultiStepOnboarding />;
  return <Outlet />;
}
