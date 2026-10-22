import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { GuestRoute } from '@/features/auth/GuestRoute';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { useAuth } from '@/features/auth/useAuth';
import { HomePage } from '@/pages/HomePage';

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
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
