import type { CategoryType } from "@/pages/categories/schema";
import { create } from "zustand";

interface CompetitionState {
  categories: CategoryType[];
  addCategory: (newCategory: CategoryType) => void;
}

export const useCompetition = create<CompetitionState>()((set) => ({
  categories: [],
  addCategory: (newCategory) =>
    set((state) => ({ categories: [...state.categories, newCategory] })),
}));
