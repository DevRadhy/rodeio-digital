import { api } from "@/providers/api";

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await api.delete(`/categories/${categoryId}`);

    return;
  } catch (error) {
    console.error(error);
  }
};
