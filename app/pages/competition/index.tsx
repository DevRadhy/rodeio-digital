import { CategoryCard } from "@/components/categories/category-card";
import { SiteHeader } from "@/components/site-header";
import { createQualification } from "@/services/qualification-service";
import { useCategoryStore } from "@/stores/category";
import { useCompetitionSessionStore } from "@/stores/competition";
import { useRegistrationStore } from "@/stores/registration";
import type { Category } from "@/types/category";
import { useNavigate } from "react-router";

export default function Competition() {
  const categories = useCategoryStore((state) => state.categories);
  const registrationByCompetition = useRegistrationStore(
    (state) => state.registrationByCompetition,
  );
  const open = useCompetitionSessionStore((state) => state.openSession);

  const navigation = useNavigate();

  const openCompetition = (category: Category) => {
    const registrations = registrationByCompetition(category.id);

    open(category.id, {
      categoryId: category.id,
      phase: "qualification",
      qualification: createQualification(category, registrations),
    });

    navigation(category.id);
  };

  return (
    <>
      <SiteHeader />
      <div className="grid grid-cols-4 gap-4 m-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onRegister={() => openCompetition(category)}
          />
        ))}
      </div>
    </>
  );
}
