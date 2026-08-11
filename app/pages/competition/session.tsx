import { useParams } from "react-router";
import { CompetitionView } from "@/components/shared/competition/competition-view";
import { useCompetition } from "@/hooks/use-competition";
import { CompetitionSessionHeader } from "../../components/shared/competition/competition-session-header";

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
