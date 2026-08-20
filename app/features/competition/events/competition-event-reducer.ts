import type { CompetitionState } from "../types/competition";
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
        currentRound: group.currentRound
          ? {
              ...group.currentRound,
              results: [
                ...group.currentRound.results,
                {
                  id: event.result.id,
                  registrationId: event.result.registrationId,
                  competitorId: event.competitor.id,
                  shot: event.competitor.shot,
                },
              ],
            }
          : null,
      };
    }),
  };
}
