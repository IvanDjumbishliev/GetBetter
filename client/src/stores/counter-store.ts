import { create } from 'zustand';

// Sanity-check store; replace with real stores as features are added.
interface CounterState {
  count: number;
  increment: () => void;
}

export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
