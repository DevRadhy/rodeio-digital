import { CategoryCard } from "@/components/registrations/category-card";
import { RegistrationDialog } from "@/components/registrations/registration-dialog";
import { SiteHeader } from "@/components/site-header";
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
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
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
          </div>
        </div>
      </div>
    </>
  );
}
