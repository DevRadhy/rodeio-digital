import type { Category } from "@/types/category";
import type {
  CompetitionGroup,
  CompetitionResult,
  CompetitionRound,
} from "@/types/competition";
import type { ClassifiedGroup } from "@/types/qualification";
import type { Registration } from "@/types/registration";

export class FinalService {
  static start(
    category: Category,
    groups: ClassifiedGroup[],
  ): CompetitionGroup[] {
    return groups.map((group) => ({
      id: group.groupId,
      name: category.duel
        ? `Força ${category.qualification.groups.find((g) => g.id === group.groupId)?.name ?? "Final"}`
        : "Final",
      currentRound: 1,
      status: "running",
      registrations: group.registrations,
      rounds: [this.createRound(1, group.registrations)],
    }));
  }

  private static createRound(
    number: number,
    registrations: Registration[],
  ): CompetitionRound {
    return {
      number,
      results: registrations.map((registration) =>
        this.createResult(registration),
      ),
    };
  }

  private static createResult(registration: Registration): CompetitionResult {
    return {
      registrationId: registration.id,
      competitors: registration.competitors.map((competitor) => ({
        competitorId: competitor.id,
        shot: null,
      })),
    };
  }
}
