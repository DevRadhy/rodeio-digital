import { CategoryCard } from "@/components/categories/category-card";
import { RegistrationDialog } from "@/components/registrations/registration-dialog";
import { SiteHeader } from "@/components/site-header";
import { useCategories } from "@/stores/categories";
import type { Category } from "@/types/category";
import { useState } from "react";

export default function Registration() {
  const categories = useCategories((state) => state.categories);
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
