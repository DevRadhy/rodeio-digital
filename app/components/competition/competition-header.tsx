import type { Category } from "@/types/category";
import type { Competition, CompetitionGroup } from "@/types/competition";

interface CompetitionHeaderProps {
  competition: Competition;
  category: Category;
  group: CompetitionGroup;
}

export function CompetitionHeader({
  competition,
  category,
  group,
}: CompetitionHeaderProps) {
  return (
    <div>
      <p className="text-2xl font-black uppercase">
        Volta {group.currentRound}{" "}
        {competition.phase === "qualification" &&
          ` de ${category.qualification.qualifyingRounds}`}
      </p>
      <p className="text-muted-foreground">
        Somente a volta atual fica liberada para laçamento. Isso evita erros de
        lançamento.
      </p>
    </div>
  );
}
