import type { QualificationGroupState } from "../types/competition";

interface CompetitionHeaderProps {
  group: QualificationGroupState;
}

export function CompetitionHeader({ group }: CompetitionHeaderProps) {
  return (
    <div>
      <p className="text-2xl font-black uppercase">
        Volta {group.currentRound?.number ?? 1}
      </p>
      <p className="text-muted-foreground">
        Somente a volta atual fica liberada para laçamento. Isso evita erros de
        lançamento.
      </p>
    </div>
  );
}
