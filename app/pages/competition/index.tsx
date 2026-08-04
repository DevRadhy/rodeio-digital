import { CategoryCard } from "@/components/categories/category-card";
import { SiteHeader } from "@/components/dashboard/site-header";
import { CompetitionService } from "@/services/competition-service";
import { useCategoryStore } from "@/stores/category";
import { useCompetitionSessionStore } from "@/stores/competition";
import { useRegistrationStore } from "@/stores/registration";
import type { Category } from "@/types/category";
import { useNavigate } from "react-router";

export default function Competition() {
  const { categories } = useCategoryStore();
  const { registrationsByCompetition } = useRegistrationStore();
  const { createCompetition } = useCompetitionSessionStore();

  const navigation = useNavigate();

  const openCompetition = (category: Category) => {
    const registrations = registrationsByCompetition(category.id);

    const competition = CompetitionService.create(category, registrations);

    createCompetition(competition);

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
