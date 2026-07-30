import { useCategories } from "@/stores/categories";
import { useCompetitionSession } from "@/stores/competition";

export function useSession(sessionId: string) {
  const session = useCompetitionSession((state) => state.getSession(sessionId));

  const competition = useCategories((state) =>
    session
      ? state.categories.find((category) => category.id === session.categoryId)
      : undefined,
  );

  return {
    session,
    competition,
  };
}
