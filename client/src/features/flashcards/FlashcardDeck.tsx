import type { Flashcard } from '@shared/types';
import { ArrowLeft, ArrowRight, Layers, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  /** Called from the summary screen's primary button. */
  onContinue: () => void;
  continueLabel?: string;
}

export function FlashcardDeck({
  flashcards,
  onContinue,
  continueLabel = 'Continue to Quiz',
}: FlashcardDeckProps) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const total = flashcards.length;
  const card = flashcards[index];

  const flip = useCallback(() => setIsFlipped((flipped) => !flipped), []);

  const goTo = useCallback(
    (next: number) => {
      setIsFlipped(false);
      if (next >= total) {
        setIsFinished(true);
      } else {
        setIndex(Math.max(0, next));
      }
    },
    [total],
  );

  const restart = () => {
    setIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  };

  useEffect(() => {
    if (isFinished) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

      if (event.key === ' ') {
        // Also stops Space from "clicking" whichever button has focus, so it always flips.
        event.preventDefault();
        flip();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFinished, index, flip, goTo]);

  if (isFinished || !card) {
    return (
      <div className="space-y-6 rounded-xl border p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Layers aria-hidden className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Deck complete!</h2>
          <p className="text-muted-foreground">
            You reviewed {total} {total === 1 ? 'card' : 'cards'}.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {total > 0 && (
            <Button variant="outline" onClick={restart}>
              <RotateCcw aria-hidden />
              Review Again
            </Button>
          )}
          <Button onClick={onContinue}>
            {continueLabel}
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((index + 1) / total) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium" aria-live="polite">
            Card {index + 1} of {total}
          </span>
          <span className="hidden text-muted-foreground sm:inline">
            Space to flip · ← → to navigate
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="[perspective:1200px]">
        {/* Keyed by card so a new card starts face-up without animating the flip back. */}
        <button
          key={card.id}
          type="button"
          onClick={flip}
          aria-label={`${isFlipped ? 'Answer' : 'Question'} side. Activate to flip.`}
          className={cn(
            'relative block h-72 w-full rounded-xl text-left transition-transform duration-500 [transform-style:preserve-3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
            isFlipped && '[transform:rotateY(180deg)]',
          )}
        >
          <CardFace label="Question" hidden={isFlipped}>
            {card.front}
          </CardFace>
          <CardFace label="Answer" hidden={!isFlipped} back>
            {card.back}
          </CardFace>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => goTo(index - 1)} disabled={index === 0}>
          <ArrowLeft aria-hidden />
          Previous
        </Button>
        <Button variant="ghost" onClick={flip}>
          Flip
        </Button>
        <Button onClick={() => goTo(index + 1)}>
          {index === total - 1 ? 'Finish' : 'Next'}
          <ArrowRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}

interface CardFaceProps {
  label: string;
  hidden: boolean;
  back?: boolean;
  children: React.ReactNode;
}

function CardFace({ label, hidden, back, children }: CardFaceProps) {
  return (
    <div
      aria-hidden={hidden}
      className={cn(
        'absolute inset-0 flex flex-col rounded-xl border p-6 shadow-sm [backface-visibility:hidden]',
        back ? 'bg-secondary [transform:rotateY(180deg)]' : 'bg-card',
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-1 items-center justify-center text-center text-xl font-medium">
        {children}
      </div>
      <span className="text-center text-xs text-muted-foreground">
        Click or press Space to flip
      </span>
    </div>
  );
}
