import { BookOpen, Compass, Home, LineChart, MessagesSquare, Newspaper, type LucideIcon } from 'lucide-react';

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
    to: '/topics',
    icon: Compass,
    isActive: (pathname, search) => pathname === '/topics' && !search.includes('enrolled=1'),
  },
  {
    label: 'My Learning',
    to: '/topics?enrolled=1',
    icon: BookOpen,
    isActive: (pathname, search) => pathname === '/topics' && search.includes('enrolled=1'),
  },
  { label: 'News', to: '/news', icon: Newspaper },
  { label: 'Community', to: '/community', icon: MessagesSquare },
  {
    label: 'Progress',
    to: '/dashboard?view=progress',
    icon: LineChart,
    isActive: (pathname, search) => pathname === '/dashboard' && search.includes('view=progress'),
  },
];
