import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPhase } from "@/utils";
import type { Competition } from "../types/competition";

interface CompetitionHeadeSessionrProps {
  competition: Competition;
}

export function CompetitionSessionHeader({
  competition,
}: CompetitionHeadeSessionrProps) {
  const navigation = useNavigate();

  const phase = formatPhase(competition.phase);

  return (
    <div className="px-8 py-8">
      <Button
        variant={"ghost"}
        className="flex items-center gap-2 my-4 -ml-4 text-muted-foreground"
        onClick={() => navigation("/competition")}
      >
        <ChevronLeft /> Modalidades
      </Button>

      {competition.phase === "qualification" &&
        competition.status === "running" && (
          <Button
            variant="outline"
            onClick={() =>
              navigation(`/registrations/${competition.categoryId}`)
            }
          >
            Adicionar inscrição
          </Button>
        )}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold">{competition.category.name}</h1>
        <Badge className={`${phase.bg} ${phase.color}`}>{phase.text}</Badge>
      </div>
    </div>
  );
}
