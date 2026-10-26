import { BookOpen, Compass, Home, LineChart, MessagesSquare, type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  isActive?: (pathname: string, search: string) => boolean;
}

export const APP_NAV: NavItem[] = [
  {
    label: 'Home',
    to: '/dashboard',
    icon: Home,
    isActive: (pathname, search) => pathname === '/dashboard' && !search.includes('view=progress'),
  },
  {
    label: 'Explore',
    to: '/explore',
    icon: Compass,
    isActive: (pathname, search) => pathname === '/explore' && !search.includes('enrolled=1'),
  },
  {
    label: 'My Learning',
    to: '/explore?enrolled=1',
    icon: BookOpen,
    isActive: (pathname, search) => pathname === '/explore' && search.includes('enrolled=1'),
  },
  { label: 'Community', to: '/community', icon: MessagesSquare },
  {
    label: 'Progress',
    to: '/dashboard?view=progress',
    icon: LineChart,
    isActive: (pathname, search) => pathname === '/dashboard' && search.includes('view=progress'),
  },
];
