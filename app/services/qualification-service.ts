import type { Category } from "@/types/category";
import type { Shot } from "@/types/competition";
import type { Qualification } from "@/types/qualification";
import type { Registration } from "@/types/registration";

export function createQualification(
  category: Category,
  registrations: Registration[],
): Qualification {
  return {
    currentRound: 0,
    registrations: registrations.map((registration) => ({
      registrationId: registration.id,
      rounds: Array.from({ length: category.rounds }, () => null).map(
        (_, round) => ({
          number: round,
          competitors: registration.competitors.map((competitor) => ({
            competitorId: competitor.id,
            shot: null,
          })),
        }),
      ),
    })),
  };
}

export function setQualificationShot(
  qualification: Qualification,
  registrationId: string,
  competitorId: string,
  shot: Shot,
): Qualification {
  return {
    ...qualification,
    registrations: qualification.registrations.map((registration) => {
      if (registration.registrationId !== registrationId) return registration;

      return {
        ...registration,
        rounds: registration.rounds.map((round) => {
          if (round.number !== qualification.currentRound) return round;

          return {
            ...round,
            competitors: round.competitors.map((competitor) =>
              competitor.competitorId === competitorId
                ? { ...competitor, shot }
                : competitor,
            ),
          };
        }),
      };
    }),
  };
}

export function isLastQualificationRound(
  qualification: Qualification,
  category: Category,
) {
  return qualification.currentRound === category.rounds;
}

export function finishCurrentRound(
  category: Category,
  qualification: Qualification,
): Qualification {
  const isLastRound = isLastQualificationRound(qualification, category);

  if (isLastRound) {
    return qualification;
  }

  return {
    ...qualification,
    currentRound: qualification.currentRound + 1,
  };
}

export function isFinished(
  category: Category,
  qualification: Qualification,
): boolean {
  return qualification.currentRound >= category.rounds ? true : false;
}
