import { CategoryCard } from "@/components/categories/category-card";
import { SiteHeader } from "@/components/dashboard/site-header";
import { CompetitionService } from "@/services/competition-service";
import { useCategoryStore } from "@/stores/category";
import { useCompetitionSessionStore } from "@/stores/competition";
import { useRegistrationStore } from "@/stores/registration";
import type { Category } from "@/types/category";
import { useNavigate } from "react-router";

export default function Competition() {
  const categories = useCategoryStore((state) => state.categories);
  const registrationsByCompetition = useRegistrationStore(
    (state) => state.registrationsByCompetition,
  );
  const open = useCompetitionSessionStore((state) => state.createCompetition);

  const navigation = useNavigate();

  const openCompetition = (category: Category) => {
    const registrations = registrationsByCompetition(category.id);

    const createCompetition = CompetitionService.create(
      category,
      registrations,
    );

    open(createCompetition);

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
