import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: { displayName: string; avatarUrl: string | null };
  className?: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '')
  ).toUpperCase();
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const base = cn('h-9 w-9 shrink-0 rounded-full', className);
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt="" className={cn(base, 'object-cover')} />;
  }
  return (
    <span
      aria-hidden
      className={cn(
        base,
        'flex items-center justify-center bg-secondary text-xs font-semibold text-secondary-foreground',
      )}
    >
      {initials(user.displayName) || '?'}
    </span>
  );
}
