import { APP_NAME } from '@shared/constants';
import { LogOut, Menu, Search, Settings, UserRound, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { StreakBadge } from '@/components/StreakBadge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserAvatar } from '@/components/UserAvatar';
import { useLogoutMutation } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';
import { useStatsQuery } from '@/features/dashboard/dashboardApi';
import { NotificationBell } from '@/features/notifications/NotificationBell';
import { heatmapDays } from '@/features/dashboard/dates';
import { todayKey } from '@/lib/time-zone';
import { useCommandPalette } from '@/stores/command-palette';
import { toast } from '@/stores/toast';

interface NavbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Navbar({ sidebarOpen, onToggleSidebar }: NavbarProps) {
  const user = useAuth((s) => s.user);
  const logout = useLogoutMutation();
  const openPalette = useCommandPalette((s) => s.open);
  const stats = useStatsQuery(heatmapDays(12, todayKey()));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 h-[var(--navbar-height)] border-b border-border bg-[var(--gb-color-background-raised)]">
      <div className="flex h-full items-center gap-3 px-3 lg:px-4">
        <button
          type="button"
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/dashboard" className="flex items-baseline gap-1 font-semibold tracking-tight">
          <span className="font-display text-lg text-primary">{APP_NAME}</span>
        </Link>

        <button
          type="button"
          onClick={openPalette}
          className="ml-2 hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-left text-sm text-muted-foreground hover:border-primary/40 sm:flex md:max-w-md"
        >
          <Search aria-hidden className="h-4 w-4 shrink-0" />
          <span className="truncate">Search topics and posts…</span>
          <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-medium lg:inline">
            Ctrl+K
          </kbd>
        </button>

        <button
          type="button"
          className="ml-auto rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground sm:hidden"
          aria-label="Search"
          onClick={openPalette}
        >
          <Search className="h-5 w-5" />
        </button>

        {stats.data && (
          <StreakBadge streak={stats.data.currentStreak} className="hidden sm:inline-flex" />
        )}
        <ThemeToggle />
        <NotificationBell />

        <div className="relative ml-0 sm:ml-1" ref={wrapRef}>
          <button
            type="button"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {user ? (
              <UserAvatar user={user} className="h-8 w-8" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
                <UserRound className="h-4 w-4" />
              </span>
            )}
            <span className="sr-only">Open account menu</span>
          </button>
          {menuOpen && (
            <div
              id={menuId}
              role="menu"
              className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-border bg-card py-1 shadow-[var(--gb-shadow-overlay)]"
            >
              <p className="truncate px-3 py-2 text-xs text-muted-foreground">
                {user?.displayName}
              </p>
              <MenuItem
                icon={UserRound}
                label="Profile"
                onClick={() => {
                  setMenuOpen(false);
                  void navigate('/profile');
                }}
              />
              <MenuItem
                icon={Settings}
                label="Settings"
                onClick={() => {
                  setMenuOpen(false);
                  void navigate('/profile#settings');
                }}
              />
              <MenuItem
                icon={LogOut}
                label={logout.isPending ? 'Logging out…' : 'Logout'}
                disabled={logout.isPending}
                onClick={() => {
                  setMenuOpen(false);
                  logout.mutate(undefined, {
                    onSuccess: () => toast.success('Signed out'),
                    onError: () => toast.error('Could not sign out'),
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: typeof UserRound;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary disabled:opacity-50"
    >
      <Icon aria-hidden className="h-4 w-4 text-muted-foreground" />
      {label}
    </button>
  );
}
