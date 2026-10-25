import { useAuth } from '@/features/auth/useAuth';
import { useLogoutMutation } from '@/features/auth/authApi';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';
import { toast } from '@/stores/toast';

export function ProfilePage() {
  const user = useAuth((s) => s.user);
  const logout = useLogoutMutation();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl">Profile</h1>
        <p className="text-muted-foreground">Account details and session controls.</p>
      </header>

      <section className="flex items-center gap-4 border border-border bg-card p-5">
        <UserAvatar user={user} className="h-14 w-14 text-base" />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{user.displayName}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </section>

      <section id="settings" className="space-y-3 border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Appearance is locked to the GetBetter dark system — high contrast, electric accent, no
          warm palettes.
        </p>
        <dl className="grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted-foreground">Role</dt>
          <dd className="font-medium">{user.role === 'ADMIN' ? 'Admin' : 'Member'}</dd>
          <dt className="text-muted-foreground">Theme</dt>
          <dd className="font-medium">Night / indigo</dd>
        </dl>
      </section>

      <Button
        variant="outline"
        onClick={() =>
          logout.mutate(undefined, {
            onSuccess: () => toast.success('Signed out'),
            onError: () => toast.error('Could not sign out'),
          })
        }
        disabled={logout.isPending}
      >
        {logout.isPending ? 'Logging out…' : 'Log out'}
      </Button>
    </div>
  );
}
