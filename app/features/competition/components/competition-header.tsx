import type {
  CompetitionState,
  QualificationGroupState,
} from "../types/competition";

interface CompetitionHeaderProps {
  competition: CompetitionState;
  group: QualificationGroupState;
}

export function CompetitionHeader({
  competition,
  group,
}: CompetitionHeaderProps) {
  return (
    <div>
      <p className="text-2xl font-black uppercase">
        Volta {group.currentRound}{" "}
        {competition.phase === "qualification" && ` de 10`}
      </p>
      <p className="text-muted-foreground">
        Somente a volta atual fica liberada para laçamento. Isso evita erros de
        lançamento.
      </p>
    </div>
  );
}
