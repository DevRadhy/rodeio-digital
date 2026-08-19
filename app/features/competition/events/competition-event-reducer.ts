import type {
  CompetitionState,
  QualificationResultState,
} from "../types/competition";
import type { CompetitionShotRegisteredEvent } from "../types/competition-event";

export function applyShotRegisteredEvent(
  state: CompetitionState,
  event: CompetitionShotRegisteredEvent["payload"],
): CompetitionState {
  return {
    ...state,
    groups: state.groups.map((group) => {
      if (group.id !== event.group.id) {
        return group;
      }

      return {
        ...group,
        status: event.group.status,
        rounds: group.rounds.map((round) => {
          if (round.id !== event.round.id) {
            return round;
          }

          const results =
            round.results.length === 0
              ? ([
                  {
                    id: event.result.id,
                    registrationId: event.result.registrationId,
                    competitors: [
                      {
                        id: event.competitor.id,
                        name:
                          group.registrations.map((registration) =>
                            registration.competitors.find(
                              (competitor) =>
                                competitor.id === event.competitor.id,
                            ),
                          )[0]?.name ?? "",
                        shot: event.competitor.shot,
                      },
                    ],
                  },
                ] satisfies QualificationResultState[])
              : round.results.map((result) => {
                  if (result.id !== event.result.id) {
                    return result;
                  }

                  return {
                    ...result,
                    competitors: result.competitors.map((competitor) => {
                      if (competitor.id !== event.competitor.id) {
                        return competitor;
                      }

                      return {
                        ...competitor,
                        shot: event.competitor.shot,
                      };
                    }),
                  };
                });

          return {
            ...round,
            results,
          };
        }),
      };
    }),
  };
}
