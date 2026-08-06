import type { Category } from "@/types/category";
import type {
  Competition,
  CompetitionGroup,
  CompetitionResult,
  CompetitionRound,
} from "@/types/competition";
import type { ClassifiedGroup } from "@/types/qualification";
import type { Registration } from "@/types/registration";
import { everyPositive } from "@/utils";

export class FinalService {
  static start(
    category: Category,
    groups: ClassifiedGroup[],
  ): CompetitionGroup[] {
    return groups.map((group) => ({
      id: group.groupId,
      name: category.final.duel
        ? `Força ${category.final.groups.find((g) => g.id === group.groupId)?.name ?? "Final"}`
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

  static nextRound(
    competition: Competition,
    group: CompetitionGroup,
  ): Competition {
    const results = group.rounds[group.currentRound - 1].results;

    return {
      ...competition,
      groups: competition.groups.map((g) => {
        if (g.id !== group.id) {
          return g;
        }

        return {
          ...group,
          currentRound: group.currentRound + 1,
          rounds: [
            ...group.rounds,
            {
              number: group.currentRound + 1,
              results: results.filter(everyPositive).map((result) => ({
                registrationId: result.registrationId,
                competitors: result.competitors.map((competitor) => ({
                  ...competitor,
                  shot: null,
                })),
              })),
            },
          ],
        };
      }),
    };
  }
}
