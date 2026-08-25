import type { Competition, Group } from "../types/competition";

interface CompetitionHeaderProps {
  group: Group;
  competition: Competition;
}

export function CompetitionHeader({
  group,
  competition,
}: CompetitionHeaderProps) {
  return (
    <div>
      <p className="text-2xl font-black uppercase">
        Volta {group.currentRound.number}
        {competition.phase === "qualification" &&
          ` de ${competition.category.qualification.rounds}`}
      </p>
      <p className="text-muted-foreground">
        Somente a volta atual fica liberada para laçamento. Isso evita erros de
        lançamento.
      </p>
    </div>
  );
}
