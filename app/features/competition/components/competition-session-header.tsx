import { CompetitionManagement } from "./competition-management";
import { Link, useNavigate } from "react-router";
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
        <CompetitionManagement competition={competition} />
        <CompetitionBadges
          status={competition.status}
          phase={competition.phase}
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link
              to={`/scoreboard/${competition.id}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          Abrir placar
        </Button>
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
      <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 rounded-xl border p-4 text-sm text-muted-foreground">
        <span>
          Tipo:{" "}
          <strong className="text-foreground">
            {
              {
                normal: "Normal",
                elimination: "Eliminatória",
                summation: "Somatória",
                duel: "Duelo por forças",
              }[competition.category.categoryType]
            }
          </strong>
        </span>
        <span>
          {competition.category.competitorsPerRegistration} competidor(es) por
          inscrição
        </span>
        <span>
          {competition.category.qualification.rounds} voltas classificatórias
        </span>
        <span>
          Até {competition.category.qualification.pelotonSize} inscrições por
          pelotão
        </span>
        <span>
          Bônus configurado:{" "}
          {competition.category.finalBonusEnabled
            ? competition.category.finalBonusLives
            : "desabilitado"}
        </span>
      </div>
    </div>
  );
}
