import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import { AppShell } from '@/components/AppShell';
import { ToastContainer } from '@/components/ToastContainer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FullPageLoader } from '@/components/FullPageLoader';
import { GuestRoute } from '@/features/auth/GuestRoute';
import { HomeRoute } from '@/features/auth/HomeRoute';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { OnboardingGate } from '@/features/onboarding/OnboardingGate';
import { useAuth } from '@/features/auth/useAuth';

const ProfilePage = lazy(() =>
  import('@/features/auth/ProfilePage').then((module) => ({ default: module.ProfilePage })),
);
const LoginPage = lazy(() =>
  import('@/features/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/features/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })),
);
const CommunityPage = lazy(() =>
  import('@/features/community/CommunityPage').then((module) => ({
    default: module.CommunityPage,
  })),
);
const PostDetailPage = lazy(() =>
  import('@/features/community/PostDetailPage').then((module) => ({
    default: module.PostDetailPage,
  })),
);
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);
const LessonPage = lazy(() =>
  import('@/features/lessons/LessonPage').then((module) => ({ default: module.LessonPage })),
);
const TopicDetailPage = lazy(() =>
  import('@/features/lessons/TopicDetailPage').then((module) => ({
    default: module.TopicDetailPage,
  })),
);
const TopicsPage = lazy(() =>
  import('@/features/lessons/TopicsPage').then((module) => ({ default: module.TopicsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/features/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

export function App() {
  const initialize = useAuth((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<OnboardingGate />}>
                <Route element={<AppShell />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/topics" element={<TopicsPage />} />
                  <Route path="/topics/:slug" element={<TopicDetailPage />} />
                  <Route path="/lessons/:id" element={<LessonPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/community/:postId" element={<PostDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
