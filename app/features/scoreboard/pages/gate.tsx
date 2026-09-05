import { useQuery } from "@tanstack/react-query";
import { Circle, Maximize, Radio, ShieldPlus, X } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-context";
import { useCompetitionEvents } from "@/features/competition/hooks/use-competition-events";
import { api } from "@/providers/api";
import { useForceLightMode } from "../hooks/use-force-light-mode";
import type { DisplayCompetitor, Scoreboard } from "../types";

export function meta() {
  return [{ title: "Ordem de entrada · Rodeo Digital" }];
}

function ResultHistory({ competitor }: { competitor: DisplayCompetitor }) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="img"
      aria-label="Últimas armadas"
    >
      {competitor.recentResults.map((result) =>
        result.shot === "positive" ? (
          <X key={result.id} className="size-7 text-primary" strokeWidth={3} />
        ) : (
          <Circle
            key={result.id}
            className="size-7 text-negative"
            strokeWidth={3}
          />
        ),
      )}
    </div>
  );
}

export default function GatePage() {
  useForceLightMode();
  const { competitionId = "" } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const connection = useCompetitionEvents(competitionId);
  const liveCompetition = useQuery({
    queryKey: ["live-display-competition", auth.event?.id],
    queryFn: async ({ signal }) =>
      (
        await api.get<{ competitionId: string | null }>("/competition/live", {
          signal,
        })
      ).data,
    refetchInterval: 2_000,
    refetchIntervalInBackground: true,
  });
  useEffect(() => {
    const liveId = liveCompetition.data?.competitionId;
    if (liveId && liveId !== competitionId)
      navigate(`/gate/${liveId}`, { replace: true });
  }, [competitionId, liveCompetition.data?.competitionId, navigate]);
  const scoreboard = useQuery({
    queryKey: ["scoreboard", competitionId],
    queryFn: async ({ signal }) =>
      (
        await api.get<Scoreboard>(`/competition/${competitionId}/scoreboard`, {
          signal,
        })
      ).data,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
  });

  if (auth.user?.globalRole === "USER" && auth.event?.role !== "DISPLAY_GATE")
    return <Navigate to="/competition" replace />;
  if (!scoreboard.data)
    return (
      <main className="light grid min-h-screen place-items-center bg-background p-10 text-foreground">
        <p className="text-2xl" role="status">
          {scoreboard.isError
            ? "Não foi possível carregar a ordem de entrada."
            : "Conectando à pista…"}
        </p>
      </main>
    );

  const { competition, group, current, next, lastResult } = scoreboard.data;
  return (
    <main className="light min-h-screen bg-background p-6 text-foreground lg:p-10">
      <header className="mb-6 flex items-center justify-between gap-6 border-b pb-5">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Ordem de entrada
          </p>
          <h1 className="font-display text-4xl font-extrabold uppercase lg:text-6xl">
            {competition.category.name}
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Badge variant="outline" className="px-4 py-2 text-base">
            {competition.phase === "qualification"
              ? "Classificatória"
              : "Final"}
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-base">
            {group?.name ?? "Aguardando pelotão"} · Volta{" "}
            {group?.roundNumber ?? "—"}
          </Badge>
          <span
            className="flex items-center gap-2 text-sm text-primary"
            role="status"
          >
            <Radio className="size-4" />
            {connection === "live" ? "Ao vivo" : "Reconectando"}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Tela cheia"
            onClick={() => void document.documentElement.requestFullscreen()}
          >
            <Maximize />
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]">
        <Card className="min-h-[58vh] justify-center border-2 border-primary bg-primary/[0.04] p-8 lg:p-12">
          <p className="font-display text-xl font-bold uppercase tracking-[0.2em] text-primary">
            {current ? "Competidor na pista" : "Aguardando o juiz"}
          </p>
          {current ? (
            <>
              <p className="mt-6 font-mono text-3xl font-bold text-muted-foreground">
                Inscrição #{current.registrationNumber}
              </p>
              <h2 className="mt-2 break-words font-display text-6xl font-extrabold uppercase leading-[0.95] lg:text-8xl">
                {current.name}
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t pt-6">
                <ResultHistory competitor={current} />
                <div className="flex items-center gap-4">
                  {current.bonus !== null && (
                    <Badge className="px-4 py-2 text-lg">
                      <ShieldPlus /> Bônus {current.bonus}
                    </Badge>
                  )}
                  <strong className="font-mono text-5xl tabular-nums text-primary">
                    {current.registrationPositiveShots}
                    <span className="text-3xl text-muted-foreground">
                      /{current.registrationTotalShots}
                    </span>
                  </strong>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-8 text-3xl text-muted-foreground">
              {group?.status === "finished"
                ? "Pelotão encerrado. Aguarde a próxima chamada."
                : "O próximo competidor aparecerá aqui automaticamente."}
            </p>
          )}
          {lastResult && (
            <p className="mt-6 text-lg text-muted-foreground">
              Última armada: <strong>{lastResult.name}</strong> ·{" "}
              <span
                className={
                  lastResult.shot === "positive"
                    ? "text-primary"
                    : "text-negative"
                }
              >
                {lastResult.shot === "positive" ? "X positiva" : "O negativa"}
              </span>
            </p>
          )}
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b px-6 py-5">
            <h2 className="font-display text-3xl font-extrabold uppercase">
              Próximos
            </h2>
          </div>
          <ol className="divide-y">
            {next.slice(0, 5).map((entry, index) => (
              <li
                key={`${entry.registrationId}/${entry.id}`}
                className="flex gap-5 px-6 py-5"
              >
                <span className="font-mono text-3xl text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-2xl font-bold">{entry.name}</p>
                  <p className="mt-1 text-muted-foreground">
                    Inscrição #{entry.registrationNumber} ·{" "}
                    {entry.positiveShots}/{entry.totalShots}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          {next.length === 0 && (
            <p className="p-8 text-xl text-muted-foreground">
              Nenhum competidor aguardando nesta volta.
            </p>
          )}
        </Card>
      </div>
    </main>
  );
}
