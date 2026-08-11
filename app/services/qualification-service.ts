import type { Category } from "@/types/category";
import type { Competition, CompetitionGroup } from "@/types/competition";
import type { QualificationResult } from "@/types/qualification";

export class QualificationService {
  private static getShots(group: CompetitionGroup, registrationId: string) {
    return group.rounds.reduce((total, round) => {
      const result = round.results.find(
        (result) => result.registrationId === registrationId,
      );

      if (!result) return total;

      return (
        total +
        result.competitors.filter((competitor) => competitor.shot).length
      );
    }, 0);
  }

  static finish(group: CompetitionGroup): QualificationResult[] {
    return group.registrations.map((registration) => ({
      registration,
      shots: QualificationService.getShots(group, registration.id),
    }));
  }

  static nextRound(
    competition: Competition,
    group: CompetitionGroup,
    category: Category,
  ): Competition {
    return {
      ...competition,
      groups: competition.groups.map((g) => {
        if (g.id !== group.id) {
          return g;
        }

        if (group.currentRound === category.qualification.qualifyingRounds) {
          return {
            ...group,
            currentRound: group.currentRound,
            status: "finished",
          };
        }

        return {
          ...group,
          currentRound: group.currentRound + 1,
        };
      }),
    };
  }
}
