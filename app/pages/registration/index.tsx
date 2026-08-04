import { CategoryCard } from "@/components/categories/category-card";
import { RegistrationDialog } from "@/components/registrations/registration-dialog";
import { SiteHeader } from "@/components/dashboard/site-header";
import { useCategoryStore } from "@/stores/category";
import type { Category } from "@/types/category";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Registration() {
  const categories = useCategoryStore((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  return (
    <div className="@container">
      <SiteHeader />
      <div className="grid grid-cols-1 gap-4 m-4 @xl:grid-cols-2 @5xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          >
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
