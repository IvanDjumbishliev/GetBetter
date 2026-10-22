import { APP_NAME } from '@shared/constants';
import { loginSchema } from '@shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/api-error';
import { useLoginMutation } from './authApi';
import { FormField } from './FormField';

export function LoginPage() {
  const location = useLocation();
  const login = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // GuestRoute redirects once the session is set.
  const onSubmit = handleSubmit((values) => login.mutate(values));

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Log in to continue learning with {APP_NAME}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <FormField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              registration={register('email')}
              error={errors.email}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              registration={register('password')}
              error={errors.password}
            />
            {login.isError && (
              <p role="alert" className="text-sm text-destructive">
                {getApiErrorMessage(login.error)}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? 'Logging in…' : 'Log in'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" state={location.state} className="text-primary underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
