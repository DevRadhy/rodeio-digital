import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { CompetitionBadges } from "@/components/shared/competition-badges";
import type { Competition } from "../types/competition";

interface CompetitionHeadeSessionrProps {
  competition: Competition;
}

export function CompetitionSessionHeader({
  competition,
}: CompetitionHeadeSessionrProps) {
  const navigation = useNavigate();

  return (
    <div className="px-4 sm:px-8">
      <PageHeader
        title={competition.category.name}
        backTo="/competition"
        backLabel="Competições"
      >
        <CompetitionBadges
          status={competition.status}
          phase={competition.phase}
        />
        {competition.phase === "qualification" &&
          competition.status === "running" && (
            <Button
              variant="outline"
              onClick={() =>
                navigation(`/registrations/${competition.categoryId}`, {
                  state: { competitionId: competition.id },
                })
              }
            >
              Adicionar inscrição
            </Button>
          )}
      </PageHeader>
    </div>
  );
}
