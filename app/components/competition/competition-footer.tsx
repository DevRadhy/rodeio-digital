import { CompetitionService } from "@/services/competition-service";
import { useCompetitionSessionStore } from "@/stores/competition";
import type { Competition, CompetitionGroup } from "@/types/competition";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import type { Category } from "@/types/category";

interface CompetitionFooterProps {
  competition: Competition;
  group: CompetitionGroup;
  category: Category;
}

export function CompetitionFooter({
  competition,
  group,
  category,
}: CompetitionFooterProps) {
  const updateCompetition = useCompetitionSessionStore(
    (state) => state.updateCompetition,
  );

  const onNextRound = () => {
    const results = CompetitionService.nextRound(competition, group, category);

    updateCompetition(results);
  };

  const isFinished = group.status === "finished";
  const isLastRound = group.currentRound === category.qualification.rounds;

  return (
    <div>
      <Button disabled={isFinished} variant={"default"} onClick={onNextRound}>
        {isLastRound ? "Finalizar Pelotão" : `Próxima volta`} <ChevronRight />
      </Button>
    </div>
  );
}
