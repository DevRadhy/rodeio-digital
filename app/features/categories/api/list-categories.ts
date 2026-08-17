import { api } from "@/providers/api";
import type { Category } from "@/types/category";

export const listCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await api.get("/categories");

    return data;
  } catch (_error) {
    return [];
  }
};
