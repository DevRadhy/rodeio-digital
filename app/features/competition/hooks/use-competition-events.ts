import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { groupKeys } from "../api/group-queries";
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
        queryKey: groupKeys.round(
          data.competitionId,
          data.group.id,
          data.round.number,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: groupKeys.group(data.competitionId, data.group.id),
      });
    };

    const handleRegistrationAdded = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as {
        competitionId: string;
        groupId: string;
      };
      queryClient.invalidateQueries({
        queryKey: ["groups", data.competitionId],
      });
      queryClient.invalidateQueries({
        queryKey: groupKeys.group(data.competitionId, data.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: groupKeys.rounds(data.competitionId, data.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: ["group-registrations", data.competitionId, data.groupId],
      });
    };
    source.addEventListener(
      "competition.registration.added",
      handleRegistrationAdded,
    );
    source.addEventListener(
      "competition.shot.registered",
      handleShotRegistered,
    );

    return () => {
      source.close();
    };
  }, [competitionId, queryClient]);
}
