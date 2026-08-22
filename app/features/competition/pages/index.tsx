import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { CategoryCard } from "@/components/shared/categories/category-card";
import { Button } from "@/components/ui/button";
import { listCategories } from "@/features/categories/api/list-categories";
import type { Category } from "@/features/categories/types/category";
import { useStartCompetition } from "@/features/competition/hooks/use-start-competition";

export function meta() {
  return [
    { title: "Competições" },
    {
      name: "Inicie ou entre em uma competição.",
      content: "Visualize as competições em andamento do evento.",
    },
  ];
}

export default function Competition() {
  const navigate = useNavigate();
  const competition = useStartCompetition();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const openCompetition = (category: Category) => {
    if (!category.session) {
      return competition.createCompetition(category.id);
    }

    navigate(category.session.id);
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
              {category.session ? "Entrar" : "Iniciar Competição"}
            </Button>
          </CategoryCard>
        ))}
      </div>
    </div>
  );
}
