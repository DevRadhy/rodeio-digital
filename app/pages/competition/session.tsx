import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { findCompetition } from "@/features/competition/api/findCompetition";
import { CompetitionSessionHeader } from "@/features/competition/components/competition-session-header";
import { CompetitionView } from "@/features/competition/components/competition-view";

export default function CompetitionRun() {
  const { competitionId } = useParams();

  const { data: competition } = useQuery({
    queryKey: ["competitions", competitionId],
    queryFn: () => findCompetition(String(competitionId)),
    enabled: !!competitionId,
  });

  if (!competition) return;

  return (
    <div>
      <CompetitionSessionHeader competition={competition} />

      <CompetitionView competition={competition} />
    </div>
  );
}
