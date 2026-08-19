import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router";
import { findCompetition } from "@/features/competition/api/findCompetition";
import { CompetitionSessionHeader } from "@/features/competition/components/competition-session-header";
import { CompetitionView } from "@/features/competition/components/competition-view";
import { useCompetitionEvents } from "../hooks/use-competition-events";
import { useCompetitionStore } from "../stores/competition-store";

export default function CompetitionRun() {
  const { competitionId } = useParams();
  const setCompetition = useCompetitionStore((state) => state.setCompetition);

  const competition = useCompetitionStore((state) => state.competition);

  const { data } = useQuery({
    queryKey: ["competitions", competitionId],
    queryFn: () => findCompetition(String(competitionId)),
    enabled: !!competitionId,
  });

  useCompetitionEvents(String(competitionId));

  useEffect(() => {
    if (data) {
      setCompetition(data);
    }
  }, [data, setCompetition]);

  if (!competition) return;

  return (
    <div>
      <CompetitionSessionHeader competition={competition} />

      <CompetitionView competition={competition} />
    </div>
  );
}
