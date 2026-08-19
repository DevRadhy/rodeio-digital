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
        Volta{" "}
        {group.rounds.find((round) => round.status === "running")?.number ?? 1}{" "}
        {competition.phase === "qualification" && ` de ${group.rounds.length}`}
      </p>
      <p className="text-muted-foreground">
        Somente a volta atual fica liberada para laçamento. Isso evita erros de
        lançamento.
      </p>
    </div>
  );
}
