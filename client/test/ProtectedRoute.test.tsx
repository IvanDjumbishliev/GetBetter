import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';

import { ProtectedRoute } from '../src/features/auth/ProtectedRoute';
import { useAuth } from '../src/features/auth/useAuth';

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    useAuth.setState({ isAuthenticated: false, isInitializing: false });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/private" element={<p>Private content</p>} />
          </Route>
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });
});
