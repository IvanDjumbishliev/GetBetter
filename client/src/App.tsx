import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AppShell } from '@/components/AppShell';
import { ToastContainer } from '@/components/ToastContainer';
import { GuestRoute } from '@/features/auth/GuestRoute';
import { HomeRoute } from '@/features/auth/HomeRoute';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProfilePage } from '@/features/auth/ProfilePage';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { useAuth } from '@/features/auth/useAuth';
import { CommunityPage } from '@/features/community/CommunityPage';
import { PostDetailPage } from '@/features/community/PostDetailPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LessonPage } from '@/features/lessons/LessonPage';
import { TopicDetailPage } from '@/features/lessons/TopicDetailPage';
import { TopicsPage } from '@/features/lessons/TopicsPage';

export function App() {
  const initialize = useAuth((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/explore" element={<TopicsPage />} />
            <Route path="/topics" element={<Navigate to="/explore" replace />} />
            <Route path="/topics/:slug" element={<TopicDetailPage />} />
            <Route path="/lessons/:id" element={<LessonPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:postId" element={<PostDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
