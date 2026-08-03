import { useCategoryStore } from "@/stores/category";
import { useCompetitionSessionStore } from "@/stores/competition";

export function useCompetition(sessionId: string) {
  const competition = useCompetitionSessionStore((state) =>
    state.getSession(sessionId),
  );

  const category = useCategoryStore((state) =>
    competition
      ? state.categories.find(
          (category) => category.id === competition.categoryId,
        )
      : undefined,
  );

  return {
    competition,
    category,
  };
}
