import { useCategories } from "@/stores/categories";
import { useCompetitionSessionStore } from "@/stores/competition";

export function useSession(sessionId: string) {
  const session = useCompetitionSessionStore((state) => state.getSession(sessionId));

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
