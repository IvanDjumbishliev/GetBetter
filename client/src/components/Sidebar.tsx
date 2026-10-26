import { NavLink, useLocation } from 'react-router';

import { cn } from '@/lib/utils';
import { APP_NAV } from './nav-items';

interface SidebarProps {
  mobileOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ mobileOpen, onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[var(--gb-color-overlay)] md:hidden"
          aria-label="Close navigation"
          onClick={onNavigate}
        />
      )}
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-[var(--navbar-height)] z-40 border-r border-border bg-[var(--gb-color-background-raised)] transition-transform duration-200 md:translate-x-0',
          'w-[var(--sidebar-width)] md:w-[var(--sidebar-width-collapsed)] lg:w-[var(--sidebar-width)]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <nav className="flex flex-col gap-1 p-3" aria-label="Primary">
          {APP_NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) => {
                const active = item.isActive
                  ? item.isActive(location.pathname, location.search)
                  : isActive;
                return cn(
                  'flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                  'md:justify-center lg:justify-start',
                  active
                    ? 'border border-primary/40 bg-primary/10 text-foreground'
                    : 'border border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground',
                );
              }}
            >
              <item.icon aria-hidden className="h-5 w-5 shrink-0" />
              <span className="md:hidden lg:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
