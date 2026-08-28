import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { CompetitionShotRegisteredEvent } from "../types/competition-event";

export function useCompetitionEvents(competitionId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const source = new EventSource(
      `http://localhost:3333/competition/${competitionId}/events`,
    );

    const handleShotRegistered = (event: MessageEvent) => {
      const data = JSON.parse(
        event.data,
      ) as CompetitionShotRegisteredEvent["payload"];

      queryClient.invalidateQueries({
        queryKey: [
          "round-group-results",
          data.competitionId,
          data.group.id,
          data.round.id,
        ],
      });
    };

    source.addEventListener(
      "competition.shot.registered",
      handleShotRegistered,
    );

    return () => {
      source.close();
    };
  }, [competitionId, queryClient]);
}
