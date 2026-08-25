import type { Competition, RoundResults } from "../types/competition";

interface CompetitionHeaderProps {
  results: RoundResults;
  competition: Competition;
}

export function CompetitionHeader({
  results,
  competition,
}: CompetitionHeaderProps) {
  return (
    <div>
      <p className="text-2xl font-black uppercase">
        Volta {results.round.number}
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
