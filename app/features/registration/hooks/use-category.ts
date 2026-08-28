import { useQuery } from "@tanstack/react-query";
import { findCategoryById } from "@/features/categories/api/find-category-by-id";

export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => findCategoryById(categoryId),
    enabled: Boolean(categoryId),
  });
}
