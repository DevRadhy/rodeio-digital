import { CategoryCard } from "@/components/registrations/category-card";
import { RegistrationDialog } from "@/components/registrations/registration-dialog";
import { useCategories } from "@/context/categories";
import type { Category } from "@/types/category";
import { useState } from "react";

export default function Registration() {
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  return (
    <>
      <section className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onRegister={() => setSelectedCategory(category)}
          />
        ))}
      </section>

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
