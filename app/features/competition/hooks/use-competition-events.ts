import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "@/providers/api";

export function useCompetitionEvents(competitionId: string) {
  const queryClient = useQueryClient();
  const [connection, setConnection] = useState<
    "connecting" | "live" | "reconnecting"
  >("connecting");
  useEffect(() => {
    setConnection("connecting");
    const source = new EventSource(
      `${(api.defaults.baseURL ?? "").replace(/\/$/, "")}/competition/${competitionId}/events`,
    );
    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      for (const key of [
        "qualification-review",
        "scoreboard",
        "competition",
        "groups",
        "competition-group",
        "competition-round",
        "group-registrations",
      ]) {
        void queryClient.invalidateQueries({ queryKey: [key, competitionId] });
      }
    };
    // Refetch on every connection: SSE notifications are not a replayable event log.
    source.onopen = () => {
      setConnection("live");
      refresh();
    };
    source.onerror = () => setConnection("reconnecting");
    for (const name of [
      "competition.management.changed",
      "competition.shot.registered",
      "competition.registration.added",
      "competition.round.finished",
      "competition.qualification.finished",
      "competition.final.started",
      "competition.scoreboard.focus.changed",
    ]) {
      source.addEventListener(name, refresh);
    }
    return () => source.close();
  }, [competitionId, queryClient]);
  return connection;
}
