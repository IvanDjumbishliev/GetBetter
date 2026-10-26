import type { CategorySummary } from '@shared/types';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryIcon } from '@/features/lessons/CategoryIcon';
import { useTopicsQuery } from '@/features/lessons/lessonsApi';
import { getTimeZone } from '@/lib/time-zone';
import { toast } from '@/stores/toast';
import { useAuth } from '@/features/auth/useAuth';
import { useCompleteOnboardingMutation } from './onboardingApi';

const STEPS = [
  { title: 'What do you want to get better at?', description: 'Choose 1–3 areas to get started.' },
  {
    title: 'How much time can you spare daily?',
    description: 'Set a daily learning goal that works for you.',
  },
  {
    title: 'Set your daily reminder',
    description: 'Choose a time to get a reminder about your lesson.',
  },
] as const;

const DAILY_GOALS = [5, 10, 15] as const;

export function MultiStepOnboarding() {
  const topics = useTopicsQuery();
  const completeOnboarding = useCompleteOnboardingMutation();
  const setUser = useAuth((state) => state.setUser);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<(typeof DAILY_GOALS)[number]>(10);
  const [reminderTime, setReminderTime] = useState('09:00');
  const categories = useMemo(() => {
    const unique = new Map<string, CategorySummary>();
    for (const topic of topics.data ?? []) unique.set(topic.category.id, topic.category);
    return [...unique.values()];
  }, [topics.data]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((selected) =>
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : selected.length < 3
          ? [...selected, categoryId]
          : selected,
    );
  };

  const finish = () => {
    completeOnboarding.mutate(
      {
        selectedCategoryIds,
        dailyGoalMinutes,
        reminderTime,
        timeZone: getTimeZone(),
      },
      {
        onSuccess: ({ user }) => {
          setUser(user);
          toast.success('Welcome to GetBetter! Your learning journey starts today.');
          void navigate('/dashboard', { replace: true });
        },
      },
    );
  };

  return (
    <main className="fixed inset-0 z-[70] flex min-h-screen items-center justify-center overflow-y-auto bg-background/95 p-4 backdrop-blur-sm">
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="my-auto w-full max-w-3xl border-border shadow-[var(--gb-shadow-overlay)]"
      >
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>GETBETTER · YOUR PLAN</span>
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <div>
            <CardTitle id="onboarding-title" className="font-display text-2xl md:text-3xl">
              {STEPS[step]!.title}
            </CardTitle>
            <CardDescription className="mt-2">{STEPS[step]!.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {step === 0 && (
            <>
              {topics.isPending && (
                <p role="status" className="py-8 text-center text-sm text-muted-foreground">
                  Loading learning areas…
                </p>
              )}
              {topics.isError && (
                <div role="alert" className="py-4 text-sm text-destructive">
                  Couldn’t load learning areas.{' '}
                  <button type="button" className="underline" onClick={() => void topics.refetch()}>
                    Try again
                  </button>
                </div>
              )}
              {topics.isSuccess && categories.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No learning areas are available right now.
                </p>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                  const selected = selectedCategoryIds.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleCategory(category.id)}
                      className={`relative flex min-h-28 flex-col items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:border-primary/50 ${
                        selected ? 'border-primary bg-primary/5' : 'border-border bg-card'
                      }`}
                    >
                      <CategoryIcon category={category} className="h-6 w-6 text-primary" />
                      <span className="font-medium">{category.name}</span>
                      {selected && <Check aria-hidden className="absolute right-3 top-3 h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {selectedCategoryIds.length} of 3 selected
              </p>
            </>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {DAILY_GOALS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  aria-pressed={dailyGoalMinutes === minutes}
                  onClick={() => setDailyGoalMinutes(minutes)}
                  className={`rounded-lg border p-6 text-center transition-colors ${
                    dailyGoalMinutes === minutes
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="block text-3xl font-semibold">{minutes}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">minutes a day</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <>
              <label className="block max-w-xs space-y-2">
                <span className="text-sm font-medium">Reminder time</span>
                <input
                  id="onboarding-reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(event) => setReminderTime(event.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-base"
                  required
                />
              </label>
              <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                Times are based on your local time zone.
              </p>
            </>
          )}

          {completeOnboarding.isError && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              We couldn’t save your plan. Please try again.
            </p>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0 || completeOnboarding.isPending}
              onClick={() => setStep((current) => current - 1)}
            >
              <ArrowLeft aria-hidden />
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                disabled={step === 0 && selectedCategoryIds.length === 0}
                onClick={() => setStep((current) => current + 1)}
              >
                Continue
                <ArrowRight aria-hidden />
              </Button>
            ) : (
              <Button type="button" disabled={completeOnboarding.isPending} onClick={finish}>
                {completeOnboarding.isPending ? 'Saving your plan…' : 'Start learning'}
                <ArrowRight aria-hidden />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
