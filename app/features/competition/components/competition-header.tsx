import type { RoundResults } from "../types/competition";

interface CompetitionHeaderProps {
  results: RoundResults;
}

export function CompetitionHeader({ results }: CompetitionHeaderProps) {
  return (
    <div>
      <p className="text-2xl font-black uppercase">
        Volta {results.round.number}
      </p>
      <p className="text-muted-foreground">
        Somente a volta atual fica liberada para laçamento. Isso evita erros de
        lançamento.
      </p>
    </div>
  );
}
