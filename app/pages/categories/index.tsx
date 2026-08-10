import { CategoryDialog } from "@/features/categories/components/category-dialog";
import { CategoryItem } from "@/features/categories/components/category-item";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { useCategoryStore } from "@/stores/category";
import type { Category } from "@/types/category";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Route } from "../../pages/categories/+types";
import { EmptyCategories } from "./empty";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/providers/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Modalidades" },
    {
      name: "Crie uma nova modalidade.",
      content: "Crie, edite e reoganize as modalidades do seu evento.",
    },
  ];
}

export default function Categories() {
  const { setEditingCategory } = useCategoryStore();
  const [open, setOpen] = useState<boolean>(false);

  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const { data } = await api.get("/categories");

      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      return await api.delete(`/categories/${categoryId}`);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_result, variables, _onMutateResult, context) => {
      context.client.setQueryData(["categories"], (old: any) =>
        old.filter((state: any) => state.id !== variables),
      );
    },
  });

  const onEdit = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const onDelete = (categoryId: string) => {
    mutation.mutateAsync(categoryId);
  };

  if (!data) return;

  return (
    <>
      {data.length ? (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(true)}>
              <Plus /> Adicionar Modalidade
            </Button>
          </div>

          <ItemGroup className="flex flex-col gap-4 p-4">
            {data.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onDelete={() => onDelete(category.id)}
              />
            ))}
          </ItemGroup>
        </>
      ) : (
        <EmptyCategories>
          <Button onClick={() => setOpen(true)}>Adicionar Modalidade</Button>
        </EmptyCategories>
      )}

      <CategoryDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
