
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completed: {
    [slug: string]: boolean;
  };
  toggleCompletion: (slug: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completed: {},
      toggleCompletion: (slug) =>
        set((state) => ({
          completed: {
            ...state.completed,
            [slug]: !state.completed[slug],
          },
        })),
    }),
    {
      name: 'progress-storage', 
    }
  )
);
