import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { findCompetition } from "@/features/competition/api/findCompetition";
import { CompetitionSessionHeader } from "@/features/competition/components/competition-session-header";
import { CompetitionView } from "@/features/competition/components/competition-view";
import { useCompetitionSocket } from "@/features/competition/hooks/use-competition-socket";

export default function CompetitionRun() {
  const { competitionId } = useParams();
  useCompetitionSocket({ sessionId: String(competitionId) });

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
