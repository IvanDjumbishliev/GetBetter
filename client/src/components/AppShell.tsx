import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { CommandPalette } from '@/components/CommandPalette';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useTopicsQuery } from '@/features/lessons/lessonsApi';
import { useThemeStore } from '@/stores/theme';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  // Warm the command palette cache while the shell is mounted.
  useTopicsQuery();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      <Sidebar mobileOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <main className="min-h-[calc(100vh-var(--navbar-height))] px-4 py-8 md:ml-[var(--sidebar-width-collapsed)] lg:ml-[var(--sidebar-width)] lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
      <CommandPalette />
    </div>
  );
}
