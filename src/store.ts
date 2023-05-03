import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IReviewState {
  id: number;
  update: (by: number) => void;
}

export const useLocalStorage = create<IReviewState>()(
  persist(
    (set, get) => ({
      id: 1,
      update: (by) =>
        set((state) => {
          return { id: get().id + 1 };
        }),
    }),
    { name: "todolist-storage" }
  )
);
