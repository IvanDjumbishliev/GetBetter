import { APP_NAME } from '@shared/constants';
import { Brain, Compass, Flame, Layers, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: Zap,
    title: 'One sharp lesson a day',
    body: 'Short, high-signal lessons designed for people who already have a full life and still want an edge.',
  },
  {
    icon: Brain,
    title: 'Quizzes that actually stick',
    body: 'Recall, flashcards, and spaced practice — not a content dump you forget by Thursday.',
  },
  {
    icon: Compass,
    title: 'Topics worth your attention',
    body: 'Science, systems, money, history, design. Pick a lane and keep moving.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="font-display text-lg text-primary">{APP_NAME}</span>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgb(51 65 85 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgb(51 65 85 / 0.35) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Daily compounding
              </p>
              <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl sm:leading-[1.1]">
                Get better on purpose.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                {APP_NAME} is a self-improvement system for driven, curious adults. One focused
                lesson a day. No fluff. No streaks-for-show — just a sharper mind by Friday.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/register">Start learning</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">I already have an account</Link>
                </Button>
              </div>
            </div>
            <SampleLessonPreview />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl">Built for people who move.</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The interface stays out of the way. The work does not.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="border border-border bg-card p-5">
                <feature.icon aria-hidden className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-[var(--gb-color-background-raised)]">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-3xl">Protect the streak. Raise the ceiling.</h2>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <Flame className="h-4 w-4 text-amber-400" />
                Show up once a day. The rest compounds.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/register">Create your account</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function SampleLessonPreview() {
  return (
    <aside className="border border-border bg-card">
      <div className="h-1.5 bg-primary" />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Sample lesson
          </span>
          <span>8 min</span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Feedback loops beat motivation</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Motivation is a weather system. A loop is architecture. Today you will map one behavior
          you already do, attach a visible score, and shrink the delay between action and signal
          until the habit starts pulling you.
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Define the smallest observable unit of progress.
          </li>
          <li className="flex gap-2">
            <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Put the score where you cannot ignore it.
          </li>
          <li className="flex gap-2">
            <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Review the loop at a fixed time, not “when you feel like it”.
          </li>
        </ul>
        <div className="border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
          Quiz unlocks after the lesson — three questions, no retry theater.
        </div>
      </div>
    </aside>
  );
}
