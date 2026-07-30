import type { Final, FinalGroup, FinalResult, FinalRound } from "@/types/final";
import type { Shot } from "@/types/qualification";
import type { Registration } from "@/types/registration";

export function startRound(
  final: Final,
  groupId: string,
  registrations: Registration[],
): Final {
  return {
    ...final,
    groups: final.groups.map((group) => {
      if (group.id !== groupId) {
        return group;
      }

      const round: FinalRound = {
        number: group.rounds.length,
        results: group.competitors
          .filter((competitor) => !competitor.eliminated)
          .map((competitor): FinalResult => {
            const registration = registrations.find(
              (r) => r.id === competitor.registrationId,
            )!;

            return {
              registrationId: competitor.registrationId,
              shots: registration.competitors.map((competitor) => ({
                competitorId: competitor.id,
                shot: null,
              })),
            };
          }),
      };

      return {
        ...group,
        rounds: [...group.rounds, round],
      };
    }),
  };
}

export function setShot(
  final: Final,
  groupId: string,
  registrationId: string,
  competitorId: string,
  value: Shot,
): Final {
  return {
    ...final,
    groups: final.groups.map((group) => {
      if (group.id !== groupId) {
        return group;
      }

      return {
        ...group,
        rounds: group.rounds.map((round, index) => {
          if (index !== group.rounds.length - 1) {
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
                shots: result.shots.map((shot) =>
                  shot.competitorId === competitorId
                    ? { ...shot, shot: value }
                    : shot,
                ),
              };
            }),
          };
        }),
      };
    }),
  };
}

export function finishRound(final: Final, groupId: string): Final {
  return {
    ...final,
    groups: final.groups.map((group) => {
      if (group.id !== groupId) {
        return group;
      }

      const currentRound = group.rounds.at(-1);

      if (!currentRound) {
        return group;
      }

      const survivors = currentRound.results
        .filter((result) => result.shots.every(({ shot }) => shot === true))
        .map((result) => result.registrationId);

      const competitors = group.competitors.map((competitor) => ({
        ...competitor,
        eliminated: !survivors.includes(competitor.registrationId),
      }));

      return {
        ...group,
        competitors,
        championId: survivors.length === 1 ? survivors[0] : undefined,
      };
    }),
  };
}

export function isFinished(group: FinalGroup) {
  return group.championId !== undefined;
}

export function getCurrentRound(group: FinalGroup) {
  return group.rounds.at(-1);
}

export function getRemainingCompetitors(group: FinalGroup) {
  return group.competitors.filter((competitor) => !competitor.eliminated);
}
