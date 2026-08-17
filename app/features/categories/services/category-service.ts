import type { CreateCategoryInput } from "@/features/categories/schemas/category-schema";
import { api } from "@/providers/api";
import type { Category } from "@/types/category";

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

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await api.delete(`/categories/${categoryId}`);

    return;
  } catch (_error) {
    return;
  }
};

export const listCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await api.get("/categories");

    return data;
  } catch (_error) {
    return [];
  }
};

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
