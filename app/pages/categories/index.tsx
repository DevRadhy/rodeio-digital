import { CategoryDialog } from "@/components/categories/category-dialog";
import { CategoryItem } from "@/components/categories/category-item";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { useCategoryStore } from "@/stores/category";
import type { Category } from "@/types/category";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Route } from "../../pages/categories/+types";
import { EmptyCategories } from "./empty";

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
  const { categories, setEditingCategory } = useCategoryStore();
  const [open, setOpen] = useState<boolean>(false);

  const onEdit = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

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
            {categories?.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={() => onEdit(category)}
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
