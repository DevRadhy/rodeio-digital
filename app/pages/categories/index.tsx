import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { CategoryDialog } from "@/features/categories/components/category-dialog";
import { CategoryItem } from "@/features/categories/components/category-item";
import {
  deleteCategory,
  listCategories,
} from "@/features/categories/services/category-service";
import { EmptyCategories } from "./empty";

export function meta() {
  return [
    { title: "Modalidades" },
    {
      name: "Crie uma nova modalidade.",
      content: "Crie, edite e reoganize as modalidades do seu evento.",
    },
  ];
}

export default function Categories() {
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (selectedId) setSelectedId(null);
    },
  });

  if (isLoading || error) return;

  return (
    <>
      {categories.length ? (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setOpen(true)}>
              <Plus /> Adicionar Modalidade
            </Button>
          </div>

          <ItemGroup className="flex flex-col gap-4 p-4">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onDelete={() => deleteMutation.mutate(category.id)}
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
