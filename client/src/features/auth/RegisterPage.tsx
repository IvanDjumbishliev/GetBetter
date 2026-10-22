import { APP_NAME, ERROR_CODES } from '@shared/constants';
import { registerSchema } from '@shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiErrorMessage, isApiErrorCode } from '@/lib/api-error';
import { useRegisterMutation } from './authApi';
import { FormField } from './FormField';

const registerFormSchema = registerSchema
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  });

export function RegisterPage() {
  const location = useLocation();
  const registerUser = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  // GuestRoute redirects once the session is set.
  const onSubmit = handleSubmit(({ confirmPassword: _, ...values }) =>
    registerUser.mutate(values, {
      onError: (error) => {
        if (isApiErrorCode(error, ERROR_CODES.EMAIL_TAKEN)) {
          setError('email', { message: getApiErrorMessage(error) });
        }
      },
    }),
  );

  const showFormError =
    registerUser.isError && !isApiErrorCode(registerUser.error, ERROR_CODES.EMAIL_TAKEN);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Start getting better with {APP_NAME} today.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <FormField
              id="displayName"
              label="Display name"
              autoComplete="nickname"
              registration={register('displayName')}
              error={errors.displayName}
            />
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
              autoComplete="new-password"
              registration={register('password')}
              error={errors.password}
            />
            <FormField
              id="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              registration={register('confirmPassword')}
              error={errors.confirmPassword}
            />
            {showFormError && (
              <p role="alert" className="text-sm text-destructive">
                {getApiErrorMessage(registerUser.error)}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={registerUser.isPending}>
              {registerUser.isPending ? 'Creating account…' : 'Sign up'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" state={location.state} className="text-primary underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
