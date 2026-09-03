import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompetitionHeaderProps {
  selectedRound: number;
  availableRounds: number;
  totalRounds?: number;
  groupLabel: string;
  pending: number | null;
  finished: boolean;
  onSelectRound(number: number): void;
}

export function CompetitionHeader({
  selectedRound,
  availableRounds,
  totalRounds,
  groupLabel,
  pending,
  finished,
  onSelectRound,
}: CompetitionHeaderProps) {
  return (
    <nav
      aria-label="Rodadas"
      className="flex items-center gap-3 rounded-2xl border bg-card p-2 sm:gap-5"
    >
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="shrink-0 rounded-xl"
        aria-label="Rodada anterior"
        disabled={selectedRound <= 1}
        onClick={() => onSelectRound(selectedRound - 1)}
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      <div
        className="min-w-0 flex-1 text-center"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="font-display text-2xl font-extrabold uppercase leading-tight tabular-nums">
          Volta {selectedRound}
          {totalRounds !== undefined && ` de ${totalRounds}`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {groupLabel} ·{" "}
          {finished
            ? "Rodada encerrada"
            : pending === null
              ? "Carregando resultados…"
              : `${pending} aguardando veredito`}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="shrink-0 rounded-xl"
        aria-label="Próxima rodada"
        disabled={selectedRound >= availableRounds}
        onClick={() => onSelectRound(selectedRound + 1)}
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  );
}
