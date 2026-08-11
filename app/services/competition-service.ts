import { v4 } from "uuid";
import type { Category } from "@/types/category";
import type {
  Competition,
  CompetitionGroup,
  CompetitionResult,
  CompetitionRound,
  Shot,
} from "@/types/competition";
import type { Registration } from "@/types/registration";
import { everyPositive, getRegistrationChuncks } from "@/utils";
import { FinalService } from "./final-service";
import { ForceService } from "./force-service";
import { QualificationService } from "./qualification-service";

export class CompetitionService {
  static create(
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
        name: `Pelotão ${index + 1}`,
        currentRound: 1,
        status: "running",
        registrations,
        rounds: Array.from(
          { length: category.qualification.qualifyingRounds },
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

  static updateShot(
    group: CompetitionGroup,
    registrationId: string,
    competitorId: string,
    shot: Shot,
  ): CompetitionGroup {
    const rounds = group.rounds.map((round) => {
      if (round.number !== group.currentRound) {
        return round;
      }

      return {
        ...round,
        results: round.results.map((result) => {
          if (result.registrationId !== registrationId) {
            return result;
          }

          return {
            ...result,
            competitors: result.competitors.map((competitor) => {
              if (competitor.competitorId !== competitorId) {
                return competitor;
              }

              return {
                ...competitor,
                shot,
              };
            }),
          };
        }),
      };
    });

    return {
      ...group,
      rounds: rounds,
    };
  }

  static nextRound(
    competition: Competition,
    group: CompetitionGroup,
    category: Category,
  ): Competition {
    if (competition.phase === "qualification") {
      return QualificationService.nextRound(competition, group, category);
    }

    return FinalService.nextRound(competition, group);
  }

  static addRegistration(
    competition: Competition,
    category: Category,
    registration: Registration,
  ): Competition {
    if (competition.phase !== "qualification") return competition;

    const availableGroup = competition.groups.find(
      (group) => group.currentRound <= 1 && group.registrations.length < 5,
    );

    if (availableGroup) {
      return {
        ...competition,
        groups: competition.groups.map((group) => {
          if (group.id !== availableGroup.id) {
            return group;
          }

          return {
            ...group,
            registrations: [...group.registrations, registration],
            rounds: Array.from(
              { length: category.qualification.qualifyingRounds },
              () => null,
            ).map((_, round) => ({
              number: round + 1,
              results: [...group.registrations, registration].map(
                (registration) => ({
                  registrationId: registration.id,
                  competitors: registration.competitors.map((competitor) => ({
                    competitorId: competitor.id,
                    shot: null,
                  })),
                }),
              ),
            })),
          };
        }),
      };
    }

    return {
      ...competition,
      groups: [
        ...competition.groups,
        {
          id: v4(),
          name: `Pelotão ${competition.groups.length + 1}`,
          currentRound: 1,
          registrations: [registration],
          status: "running",
          rounds: Array.from(
            { length: category.qualification.qualifyingRounds },
            () => null,
          ).map((_, round) => ({
            number: round + 1,
            results: [
              {
                registrationId: registration.id,
                competitors: registration.competitors.map((competitor) => ({
                  competitorId: competitor.id,
                  shot: null,
                })),
              },
            ],
          })),
        },
      ],
    };
  }

  static finishQualification(
    competition: Competition,
    category: Category,
  ): Competition {
    const results = competition.groups.flatMap((group) =>
      QualificationService.finish(group),
    );

    const classified = ForceService.classify(category, results);

    const final = FinalService.start(category, classified);

    return {
      ...competition,
      phase: "final",
      status: "running",
      groups: final,
    };
  }
}
