import { CategoryCard } from "@/components/categories/category-card";
import { RegistrationDialog } from "@/components/registrations/registration-dialog";
import { SiteHeader } from "@/components/dashboard/site-header";
import { useCategoryStore } from "@/stores/category";
import type { Category } from "@/types/category";
import { useState } from "react";

export default function Registration() {
  const categories = useCategoryStore((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  return (
    <>
      <SiteHeader />
      <div className="grid grid-cols-4 gap-4 p-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onRegister={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      <RegistrationDialog
        category={selectedCategory}
        open={!!selectedCategory}
        onOpenChange={(open) => {
          if (!open) setSelectedCategory(null);
        }}
      />
    </>
  );
}
