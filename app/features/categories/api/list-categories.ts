import type { Category } from "@/features/categories/types/category";
import { api } from "@/providers/api";

export const listCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await api.get("/categories");

    return data;
  } catch (_error) {
    return [];
  }
};
