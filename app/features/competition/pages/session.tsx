import { useParams } from "react-router";
import { CompetitionSessionHeader } from "@/features/competition/components/competition-session-header";
import { CompetitionView } from "../components/competition-view";
import { useCompetition } from "../hooks/use-competition";
import { useCompetitionEvents } from "../hooks/use-competition-events";

export function meta() {
  return [
    { title: "Competição" },
    {
      name: "Julge armadas, navegue entre pelotões.",
      content: "Visualize competidores, rodadas e pelotões em andamento.",
    },
  ];
}

export default function CompetitionRun() {
  const { competitionId } = useParams();

  const { data: competition } = useCompetition(String(competitionId));

  useCompetitionEvents(String(competitionId));

  if (!competition) return;

  return (
    <div>
      <CompetitionSessionHeader competition={competition} />

      <CompetitionView competition={competition} />
    </div>
  );
}
