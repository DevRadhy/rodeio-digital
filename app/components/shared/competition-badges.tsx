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
      style: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
    },
    finished: {
      label: "Encerrada",
      style:
        "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
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
              ? "border-amber-300 text-amber-800 dark:text-amber-200"
              : "border-emerald-300 text-emerald-800 dark:text-emerald-200"
          }
        >
          {phase === "qualification" ? "Classificatória" : "Final"}
        </Badge>
      )}
    </>
  );
}
