import { api } from "@/providers/api";
import type { Category } from "@/types/category";
import type { CreateCategoryInput } from "../schemas/category-schema";

export const createCategory = async (
  category: CreateCategoryInput,
): Promise<Category | null> => {
  try {
    const { data } = await api.post("/categories", category);

    return data;
  } catch (_error) {
    return null;
  }
};
