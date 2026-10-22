import { APP_NAME } from '@shared/constants';
import { Link, NavLink, Outlet } from 'react-router';

import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';
import { cn } from '@/lib/utils';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors hover:text-foreground',
    isActive ? 'text-foreground' : 'text-muted-foreground',
  );

export function AppLayout() {
  const user = useAuth((s) => s.user);
  const logout = useLogoutMutation();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-14 items-center gap-6">
          <Link to="/" className="font-bold tracking-tight">
            {APP_NAME}
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/topics" className={navLinkClass}>
              Topics
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.displayName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}
