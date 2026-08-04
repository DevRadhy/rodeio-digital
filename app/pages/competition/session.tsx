import { useCompetition } from "@/hooks/use-competition";
import { useParams } from "react-router";
import { CompetitionSessionHeader } from "../../components/competition/competition-session-header";
import { CompetitionView } from "@/components/competition/competition-view";

export default function CompetitionRun() {
  const { categoryId } = useParams();

  if (!categoryId) return;

  const { category, competition } = useCompetition(categoryId);

  if (!category || !competition) return;

  return (
    <div>
      <CompetitionSessionHeader competition={competition} category={category} />

      <CompetitionView competition={competition} category={category} />
    </div>
  );
}
