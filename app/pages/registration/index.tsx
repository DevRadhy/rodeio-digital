import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryCard } from "@/components/shared/categories/category-card";
import { Button } from "@/components/ui/button";
import { listCategories } from "@/features/categories/services/category-service";
import { RegistrationDialog } from "@/features/registration/components/registration-dialog";
import type { Category } from "@/types/category";

export function meta() {
  return [
    { title: "Inscrições" },
    {
      name: "Adicione uma nova modalidade.",
      content: "Adicione, edite e reoganize as inscrições das modalidades.",
    },
  ];
}

export default function Registration() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 m-4 @xl:grid-cols-2 @5xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category}>
            <Button
              variant={"secondary"}
              onClick={() => setSelectedCategory(category)}
              className={"w-full"}
            >
              <Plus /> Adicionar Inscrição
            </Button>
          </CategoryCard>
        ))}
      </div>

      <RegistrationDialog
        category={selectedCategory}
        open={!!selectedCategory}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(null);
        }}
      />
    </div>
  );
}
