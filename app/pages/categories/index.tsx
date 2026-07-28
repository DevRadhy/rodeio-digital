import { CategoryDialog } from "@/components/categories/category-dialog";
import { CategoryItem } from "@/components/categories/category-item";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { useCategories } from "@/context/categories";
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
  const { categories, setEditingCategory } = useCategories();
  const [open, setOpen] = useState<boolean>(false);

  const onEdit = (category: Category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
                <Button onClick={() => setOpen(true)}>
                  Adicionar Modalidade
                </Button>
              </EmptyCategories>
            )}

            <CategoryDialog open={open} onOpenChange={setOpen} />
          </div>
        </div>
      </div>
    </>
  );
}
