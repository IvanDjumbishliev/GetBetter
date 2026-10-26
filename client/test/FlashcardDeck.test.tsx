import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FlashcardDeck } from '../src/features/flashcards/FlashcardDeck';

const flashcards = [
  { id: 'card-1', front: 'Question one', back: 'Answer one' },
  { id: 'card-2', front: 'Question two', back: 'Answer two' },
];

describe('FlashcardDeck', () => {
  it('flips cards, navigates the deck, and shows completion', async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<FlashcardDeck flashcards={flashcards} onContinue={onContinue} />);

    expect(screen.getByText('Question one')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /question side/i }));
    expect(screen.getByText('Answer one')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Question two')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Finish' }));

    expect(screen.getByText('Deck complete!')).toBeInTheDocument();
    expect(screen.getByText('You reviewed 2 cards.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /continue to quiz/i }));
    expect(onContinue).toHaveBeenCalledOnce();
  });
});
