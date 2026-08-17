import type { Category } from "@/features/categories/types/category";
import { api } from "@/providers/api";

export const findCategoryById = async (
  categoryId: string,
): Promise<Category | null> => {
  try {
    const { data } = await api.get(`/categories/${categoryId}`);

    return data;
  } catch (_error) {
    return null;
  }
};
