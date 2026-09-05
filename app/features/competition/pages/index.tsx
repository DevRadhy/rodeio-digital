import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { CategoryCard } from "@/components/shared/categories/category-card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-context";
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
  const auth = useAuth();
  const competition = useStartCompetition();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });

  const openCompetition = (category: Category) => {
    const role = auth.event?.role;
    if (!category.session) {
      if (
        ["ANNOUNCER", "DISPLAY_GATE", "DISPLAY_SCOREBOARD"].includes(role ?? "")
      )
        return;
      return competition.createCompetition(category.id);
    }
    if (role === "DISPLAY_GATE")
      return navigate(`/gate/${category.session.id}`);
    if (role === "DISPLAY_SCOREBOARD" || role === "ANNOUNCER")
      return navigate(`/scoreboard/${category.session.id}`);
    navigate(category.session.id);
  };

  return (
    <div className="@container">
      <div className="mx-4">
        <PageHeader
          title="Competições"
          description="Inicie uma competição ou acompanhe uma sessão existente."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 m-4 @xl:grid-cols-2 @5xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category}>
            <Button
              variant={"secondary"}
              onClick={() => openCompetition(category)}
              disabled={
                competition.isPending ||
                (!category.session &&
                  ["ANNOUNCER", "DISPLAY_GATE", "DISPLAY_SCOREBOARD"].includes(
                    auth.event?.role ?? "",
                  ))
              }
              className={"w-full"}
            >
              {category.session
                ? ["ANNOUNCER", "DISPLAY_GATE", "DISPLAY_SCOREBOARD"].includes(
                    auth.event?.role ?? "",
                  )
                  ? "Acompanhar"
                  : "Entrar"
                : ["ANNOUNCER", "DISPLAY_GATE", "DISPLAY_SCOREBOARD"].includes(
                      auth.event?.role ?? "",
                    )
                  ? "Aguardando início"
                  : "Iniciar competição"}
            </Button>
          </CategoryCard>
        ))}
      </div>
    </div>
  );
}
