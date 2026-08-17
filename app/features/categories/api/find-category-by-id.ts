import { api } from "@/providers/api";
import type { Category } from "@/types/category";

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
