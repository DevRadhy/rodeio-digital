import { Badge } from "@/components/ui/badge";
import type { Phase, Status } from "@/features/competition/types/competition";

export function CompetitionBadges({
  status = "not_started",
  phase,
}: {
  status?: Status;
  phase?: Phase;
}) {
  const states = {
    not_started: {
      label: "Não iniciada",
      style: "bg-muted text-muted-foreground",
    },
    running: {
      label: "Em andamento",
      style: "bg-success/15 text-primary",
    },
    finished: {
      label: "Encerrada",
      style: "bg-muted text-muted-foreground",
    },
  };
  const state = states[status];
  return (
    <>
      <Badge
        variant="secondary"
        className={state.style}
        aria-label={`Status: ${state.label}`}
      >
        {state.label}
      </Badge>
      {phase && (
        <Badge
          variant="outline"
          aria-label={`Fase: ${phase === "qualification" ? "Classificatória" : "Final"}`}
          className={
            phase === "qualification"
              ? "border-rope/50 bg-rope/10 text-rope-ink"
              : "border-primary/30 bg-primary/10 text-primary"
          }
        >
          {phase === "qualification" ? "Classificatória" : "Final"}
        </Badge>
      )}
    </>
  );
}
