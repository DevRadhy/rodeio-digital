import type { Category } from "@/types/category";
import { create } from "zustand";

interface CategoriesState {
  categories: Category[];
  editingCategory?: Category;
  addCategory: (newCategory: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  setEditingCategory: (category?: Category) => void;
}

export const useCategories = create<CategoriesState>()((set) => ({
  categories: [],
  editingCategory: undefined,
  addCategory: (newCategory) =>
    set((state) => ({ categories: [...state.categories, newCategory] })),
  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((item) =>
        item.id === category.id ? category : item,
      ),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((item) => item.id !== id),
    })),
  setEditingCategory: (category) => set(() => ({ editingCategory: category })),
}));
