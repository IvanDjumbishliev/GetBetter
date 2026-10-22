import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { AppLayout } from '@/components/AppLayout';
import { GuestRoute } from '@/features/auth/GuestRoute';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { useAuth } from '@/features/auth/useAuth';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LessonPage } from '@/features/lessons/LessonPage';
import { TopicDetailPage } from '@/features/lessons/TopicDetailPage';
import { TopicsPage } from '@/features/lessons/TopicsPage';

export function App() {
  const initialize = useAuth((s) => s.initialize);

  // Restore the session from the refresh cookie on first load.
  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/topics/:slug" element={<TopicDetailPage />} />
            <Route path="/lessons/:id" element={<LessonPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
