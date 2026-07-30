import type { CompetitorShot } from "@/types/competitor";
import type { FinalRound } from "@/types/final";
import type {
  Qualification,
  QualificationRegistration,
} from "@/types/qualification";

export function competitorHits(competitor: CompetitorShot[]): number {
  return competitor.reduce((total, shot) => total + (shot.shot ? 1 : 0), 0);
}

export function registrationHits(
  registration: QualificationRegistration,
): number {
  return registration.rounds.reduce((total, round) => {
    return (
      total +
      round.competitors.reduce(
        (subtotal, competitor) => subtotal + (competitor.shot ? 1 : 0),
        0,
      )
    );
  }, 0);
}

export function finalResultPerfect(
  result: FinalRound["results"][number],
): boolean {
  return result.shots.every((shot) => shot.shot === true);
}

export function qualificationRanking(qualification: Qualification) {
  return qualification.registrations
    .map((registration) => ({
      registrationId: registration.registrationId,
      hits: registrationHits(registration),
    }))
    .sort((a, b) => b.hits - a.hits);
}

export function finalRoundsSurvivors(round: FinalRound): string[] {
  return round.results
    .filter(finalResultPerfect)
    .map((result) => result.registrationId);
}
