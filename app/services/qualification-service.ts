import type { Category } from "@/types/category";
import type { Competition, CompetitionGroup } from "@/types/competition";
import type { QualificationResult } from "@/types/qualification";
import type { Registration } from "@/types/registration";
import { getRegistrationChuncks } from "@/utils";
import { v4 } from "uuid";

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

  static startcreate(
    category: Category,
    registrations: Registration[],
  ): Competition {
    const registrationsChunks = getRegistrationChuncks(registrations, 5);

    return {
      categoryId: category.id,
      phase: "qualification",
      status: "running",
      groups: registrationsChunks.map((registrations, index) => ({
        id: v4(),
        currentRound: 1,
        name: `Pelotão ${index + 1}`,
        status: "running",
        registrations: registrations,
        rounds: Array.from(
          { length: category.qualification.rounds },
          () => null,
        ).map((_, round) => ({
          number: round + 1,
          results: registrations.map((registration) => ({
            registrationId: registration.id,
            competitors: registration.competitors.map((competitor) => ({
              competitorId: competitor.id,
              shot: null,
            })),
          })),
        })),
      })),
    };
  }

  static finish(group: CompetitionGroup): QualificationResult[] {
    return group.registrations.map((registration) => ({
      registration,
      shots: this.getShots(group, registration.id),
    }));
  }
}
