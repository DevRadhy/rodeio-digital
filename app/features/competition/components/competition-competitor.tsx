import { Circle, X } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import type {
  Group,
  JudgedCompetitor,
  Result,
  Shot,
} from "../types/competition";
import { ShotButtons } from "./shot-buttons";

interface CompetitionCompetitorProps {
  group: Group;
  competitor: JudgedCompetitor;
  result?: Result;
  allowCorrection?: boolean;
  saving?: boolean;
  isJudging?: boolean;
  handleRegisterShot(competitorId: string, shot: Shot): void;
}

export function CompetitionCompetitor({
  group,
  competitor,
  result,
  allowCorrection,
  saving,
  isJudging,
  handleRegisterShot,
}: CompetitionCompetitorProps) {
  return (
    <Item
      size={"xs"}
      className={`flex-wrap gap-y-3 ${isJudging ? "rounded-lg bg-success/10" : ""}`}
      aria-current={isJudging ? "true" : undefined}
    >
      <ItemContent className="min-w-0">
        <ItemTitle className="flex-wrap gap-x-3 text-base font-bold">
          <span className="wrap-break-word">{competitor.name}</span>
          {isJudging && (
            <span className="text-xs font-medium text-primary">
              Julgando agora
            </span>
          )}
          <span className="text-sm font-medium font-mono tabular-nums text-muted-foreground">
            {competitor.positiveShots}/{competitor.totalShots}
          </span>
        </ItemTitle>
        {competitor.recentResults.length > 0 ? (
          <ol
            aria-label={`Últimos ${competitor.recentResults.length} resultados de ${competitor.name}, do mais antigo ao mais recente`}
            className="mt-1 flex flex-wrap items-center gap-1.5"
          >
            {competitor.recentResults.map((result) => (
              <li
                key={result.id}
                title={`Volta ${result.roundNumber}: ${result.shot === "positive" ? "positiva" : "negativa"}`}
              >
                <span className="sr-only">
                  Volta {result.roundNumber}:{" "}
                  {result.shot === "positive" ? "positiva" : "negativa"}
                </span>
                {result.shot === "positive" ? (
                  <X
                    aria-hidden="true"
                    className="size-3.5 text-primary"
                    strokeWidth={3}
                  />
                ) : (
                  <Circle
                    aria-hidden="true"
                    className="size-3.5 text-negative"
                    strokeWidth={2.5}
                  />
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Ainda sem armadas jogadas.
          </p>
        )}
      </ItemContent>
      <ItemActions className="flex-wrap">
        <ShotButtons
          value={result?.shot ?? null}
          disabled={
            saving ||
            ((group.status === "finished" ||
              group.currentRound.status === "finished") &&
              !(allowCorrection && result))
          }
          setShot={(shot) => handleRegisterShot(competitor.id, shot)}
        />
      </ItemActions>
    </Item>
  );
}
