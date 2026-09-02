import type { Category } from "@/features/categories/types/category";
import { api } from "@/providers/api";
import type { CreateCategoryInput } from "../schemas/category-schema";

export const createCategory = async (
  category: CreateCategoryInput,
): Promise<Category> => {
  const { data } = await api.post("/categories", category);
  return data;
};
