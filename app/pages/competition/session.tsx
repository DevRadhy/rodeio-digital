import { useSession } from "@/hooks/use-session";
import { useParams } from "react-router";
import { CompetitionHeader } from "../../components/competition/competition-header";
import { QualificationView } from "@/components/qualification/qualification-view";

export default function CompetitionRun() {
  const { categoryId } = useParams();

  if (!categoryId) return;

  const { session, competition } = useSession(categoryId);

  if (!session || !competition) return;

  return (
    <div>
      <CompetitionHeader competition={competition} session={session} />

      {session.run.phase === "qualification" && (
        <QualificationView competition={competition} session={session} />
      )}
    </div>
  );
}
