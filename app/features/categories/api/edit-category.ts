import { api } from "@/providers/api";
import type { Category } from "@/types/category";
import type { CreateCategoryInput } from "../schemas/category-schema";

export const editCategory = async (
  categoryId: string,
  category: CreateCategoryInput,
): Promise<Category | null> => {
  try {
    const { data } = await api.put(`/categories/${categoryId}`, category);

    return data;
  } catch (_error) {
    return null;
  }
};
