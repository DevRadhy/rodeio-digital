import { CategoryCard } from "@/components/categories/category-card";
import { Button } from "@/components/ui/button";
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
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 m-4 @xl:grid-cols-2 @5xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category}>
            <Button
              variant={"secondary"}
              onClick={() => openCompetition(category)}
              className={"w-full"}
            >
              Abrir Modalidade
            </Button>
          </CategoryCard>
        ))}
      </div>
    </div>
  );
}
