import type { QualificationRoundState } from "../types/competition";

interface CompetitionRoundProps {
  round: QualificationRoundState;
}

export function CompetitionRound({ round }: CompetitionRoundProps) {
  return (
    <div>
      <header>
        <h1>Volta {round.number}</h1>
      </header>
    </div>
  );
}
