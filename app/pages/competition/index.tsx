import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { CategoryCard } from "@/components/shared/categories/category-card";
import { Button } from "@/components/ui/button";
import { listCategories } from "@/features/categories/services/category-service";
import { CompetitionService } from "@/services/competition-service";
import { useCategoryStore } from "@/stores/category";
import { useCompetitionSessionStore } from "@/stores/competition";
import { useRegistrationStore } from "@/stores/registration";
import type { Category } from "@/types/category";

export default function Competition() {
  const navigation = useNavigate();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const openCompetition = (category: Category) => {
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
