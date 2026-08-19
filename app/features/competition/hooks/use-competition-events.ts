import { useEffect } from "react";
import { useCompetitionStore } from "../stores/competition-store";

export function useCompetitionEvents(competitionId: string) {
  const applyShotRegistered = useCompetitionStore(
    (state) => state.applyShotRegistered,
  );

  useEffect(() => {
    const source = new EventSource(
      `http://localhost:3333/competition/${competitionId}/events`,
    );

    const handleShotRegistered = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      applyShotRegistered(data);
    };

    source.addEventListener(
      "competition.shot.registered",
      handleShotRegistered,
    );

    return () => {
      source.close();
    };
  }, [competitionId, applyShotRegistered]);
}
