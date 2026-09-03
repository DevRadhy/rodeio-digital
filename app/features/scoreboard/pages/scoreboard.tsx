import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Circle, Maximize, Radio, ShieldPlus, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { api } from "@/providers/api";
import { useCompetitionEvents } from "@/features/competition/hooks/use-competition-events";
import type { DisplayCompetitor, DisplayGroup, Scoreboard } from "../types";

export function meta() {
  return [{ title: "Placar ao vivo · Rodeo Digital" }];
}

function History({
  competitor,
  large = false,
}: {
  competitor: DisplayCompetitor;
  large?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${large ? "w-fit rounded-xl bg-card p-2" : ""}`}
      aria-label={`Últimos resultados de ${competitor.name}`}
    >
      {competitor.recentResults.length === 0 && (
        <span className="text-sm text-muted-foreground">Ainda sem armadas</span>
      )}
      {competitor.recentResults.map((result) => (
        <span
          key={result.id}
          title={`Volta ${result.roundNumber}: ${result.shot === "positive" ? "positiva" : "negativa"}`}
        >
          <span className="sr-only">
            Volta {result.roundNumber}:{" "}
            {result.shot === "positive" ? "positiva" : "negativa"}
          </span>
          {result.shot === "positive" ? (
            <X
              aria-hidden
              className={`${large ? "size-8" : "size-4"} text-primary`}
              strokeWidth={3}
            />
          ) : (
            <Circle
              aria-hidden
              className={`${large ? "size-8" : "size-4"} text-negative`}
              strokeWidth={2.5}
            />
          )}
        </span>
      ))}
    </div>
  );
}
function Bonus({ value }: { value: number | null }) {
  if (value === null) return null;
  return (
    <Badge className="border-rope/30 bg-rope/10 text-rope-ink">
      <ShieldPlus />
      Bônus {value}
    </Badge>
  );
}

function Standings({
  title,
  groups,
  tick,
  duel,
}: {
  title: string;
  groups: DisplayGroup[];
  tick: number;
  duel: boolean;
}) {
  const rows = groups.flatMap((group) =>
    group.registrations.map((registration) => ({ group, registration })),
  );
  // Limit names rather than registrations so team entries also fit on a TV.
  const chunks: (typeof rows)[] = [[]];
  let used = 0;
  for (const row of rows) {
    for (let offset = 0; offset < row.registration.competitors.length; ) {
      if (used === 4) {
        chunks.push([]);
        used = 0;
      }
      const competitors = row.registration.competitors.slice(
        offset,
        offset + 4 - used,
      );
      chunks[chunks.length - 1].push({
        ...row,
        registration: { ...row.registration, competitors },
      });
      used += competitors.length;
      offset += competitors.length;
    }
  }
  const pages = chunks.length;
  const page = tick % pages;
  return (
    <Card className="gap-0 overflow-hidden border-border bg-card text-foreground py-0 shadow-none">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-2xl font-bold uppercase">{title}</h2>
        <span className="text-xs text-muted-foreground">
          {rows.length} inscrições · {page + 1}/{pages}
        </span>
      </div>
      {groups
        .filter((group) => group.registrations.length === 0)
        .map((group) => (
          <p
            key={group.id}
            className="border-b border-border px-5 py-4 text-muted-foreground"
          >
            <strong className="text-foreground">{group.name}</strong> ·{" "}
            {group.phase === "qualification"
              ? "Sem inscrições neste pelotão."
              : duel
                ? "Nenhum competidor classificou nesta força."
                : "Nenhum competidor classificou neste grupo de final."}
          </p>
        ))}
      {rows.length === 0 && groups.length === 0 ? (
        <p className="p-6 text-muted-foreground">
          {title === "Parciais da final"
            ? "Aguardando definição dos finalistas."
            : "Sem inscrições nesta fase."}
        </p>
      ) : (
        <div className="divide-y divide-border">
          {chunks[page].map(({ group, registration }) => (
            <div
              key={`${group.id}/${registration.id}`}
              className="flex items-start gap-4 px-5 py-3"
            >
              <span className="pt-1 font-mono text-sm text-muted-foreground">
                #{registration.number}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>
                    {group.name} · {group.activeRegistrationCount} ativas
                  </span>
                  <span>
                    {registration.status === "eliminated"
                      ? "Eliminada"
                      : group.status === "finished"
                        ? "Encerrada"
                        : group.status === "not_started"
                          ? "Aguardando início"
                          : "Em disputa"}
                  </span>
                  <Bonus value={registration.bonus} />
                </div>
                {registration.competitors.map((competitor) => (
                  <div
                    key={competitor.id}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-1"
                  >
                    <span className="break-words text-base font-medium">
                      {competitor.name}{" "}
                      <span className="text-sm text-muted-foreground">
                        {competitor.positiveShots}/{competitor.totalShots}
                      </span>
                    </span>
                    <History competitor={competitor} />
                  </div>
                ))}
              </div>
              <strong className="text-2xl font-mono tabular-nums text-primary">
                {registration.positiveShots}
                <span className="text-lg text-muted-foreground">
                  /{registration.totalShots}
                </span>
              </strong>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function ScoreboardPage() {
  const { competitionId = "" } = useParams();
  const connection = useCompetitionEvents(competitionId);
  const [tick, setTick] = useState(0);
  const [fullscreenError, setFullscreenError] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 12000);
    return () => clearInterval(timer);
  }, []);
  const query = useQuery({
    queryKey: ["scoreboard", competitionId],
    queryFn: async ({ signal }) =>
      (
        await api.get<Scoreboard>(`/competition/${competitionId}/scoreboard`, {
          signal,
        })
      ).data,
    staleTime: 0,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });
  const data = query.data;
  const live = connection === "live" && !query.isError;
  if (!data)
    return (
      <main className="dark min-h-screen bg-background p-12 text-foreground">
        <h1 className="text-3xl font-bold">Placar da competição</h1>
        <p className="mt-4" role="status">
          {query.isError
            ? "Não foi possível carregar o placar. Verifique a conexão e o endereço da competição."
            : "Conectando à arena…"}
        </p>
        {query.isError && (
          <Button className="mt-4" onClick={() => query.refetch()}>
            Tentar novamente
          </Button>
        )}
      </main>
    );
  const { competition, group, current, next } = data;
  const finished = competition.status === "finished";
  return (
    <main className="dark min-h-screen bg-background px-5 py-6 text-foreground sm:px-8 lg:px-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Rodeo Digital · Arena
          </p>
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight lg:text-5xl">
            {competition.category.name}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="border-border bg-muted px-3 py-2 text-sm text-foreground">
            {competition.phase === "qualification" ? "Classificação" : "Final"}
          </Badge>
          <span
            className={`flex items-center gap-2 text-sm ${live ? "text-primary" : "text-rope-ink"}`}
            role="status"
          >
            <Radio className="size-4" />
            {live
              ? finished
                ? "Encerrada"
                : "Ao vivo"
              : "Reconectando · dados podem estar desatualizados"}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Tela cheia"
            onClick={async () => {
              try {
                if (document.fullscreenElement) await document.exitFullscreen();
                else await document.documentElement.requestFullscreen();
                setFullscreenError(false);
              } catch {
                setFullscreenError(true);
              }
            }}
          >
            <Maximize />
          </Button>
        </div>
      </header>
      {fullscreenError && (
        <p className="mb-4 text-rope-ink" role="alert">
          Use F11 para abrir o placar em tela cheia.
        </p>
      )}
      <div className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <Card className="relative gap-5 overflow-hidden border-primary/30 bg-brand-deep p-6 text-brand-deep-foreground [&_.text-muted-foreground]:text-brand-deep-foreground/80 shadow-none lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="font-semibold uppercase tracking-widest text-primary">
              {finished
                ? "Competição encerrada"
                : current
                  ? "Na pista agora"
                  : "Intervalo"}
            </span>
            <span className="text-foreground">
              {group?.name ?? "Aguardando pelotão"} · Volta{" "}
              {group?.roundNumber ?? "—"}
            </span>
          </div>
          {current ? (
            <>
              <div>
                <p className="mb-2 text-lg text-primary">
                  Inscrição #{current.registrationNumber}
                </p>
                <h2 className="break-words text-4xl font-bold leading-tight tracking-tight xl:text-6xl">
                  {current.name}
                </h2>
              </div>
              <History competitor={current} large />
              <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Positivas / armadas jogadas
                  </p>
                  <p className="text-4xl font-bold font-mono tabular-nums">
                    {current.positiveShots}
                    <span className="text-2xl text-muted-foreground">
                      /{current.totalShots}
                    </span>
                  </p>
                </div>
                <div className="space-y-2 text-right">
                  <Bonus value={current.bonus} />
                  <p className="text-sm text-muted-foreground">
                    Parcial da inscrição{" "}
                    <strong className="ml-2 font-mono text-xl text-foreground">
                      {current.registrationPositiveShots}/
                      {current.registrationTotalShots}
                    </strong>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-48 flex-col justify-center gap-3">
              <Trophy className="size-10 text-primary" />
              <h2 className="text-3xl font-bold">
                {group?.registrations.length === 0
                  ? competition.category.categoryType === "duel"
                    ? "Nenhum competidor classificou nesta força"
                    : "Nenhum competidor classificou neste grupo de final"
                  : finished
                    ? "Resultados da competição"
                    : !group?.roundId
                      ? "Aguardando início da final"
                      : group.status === "finished"
                        ? "Pelotão encerrado"
                        : "Volta concluída"}
              </h2>
              <p className="text-muted-foreground">
                {finished
                  ? "Confira as parciais de cada fase abaixo."
                  : "Aguardando o juiz liberar a próxima disputa."}
              </p>
            </div>
          )}
          {data.lastResult && (
            <div
              className="flex flex-wrap items-center gap-2 border-t border-border pt-3 text-sm"
              role="status"
            >
              <span className="text-muted-foreground">
                Última armada · Volta {data.lastResult.roundNumber}
              </span>
              <strong>
                {data.lastResult.name} · #{data.lastResult.registrationNumber}
              </strong>
              <span
                className={
                  data.lastResult.shot === "positive"
                    ? "rounded-md bg-card px-2 py-1 font-mono font-bold text-primary"
                    : "rounded-md bg-card px-2 py-1 font-mono font-bold text-negative"
                }
              >
                {data.lastResult.shot === "positive"
                  ? "X POSITIVA"
                  : "O NEGATIVA"}
              </span>
            </div>
          )}
        </Card>
        <Card className="gap-0 border-border bg-card py-0 text-foreground shadow-none">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-2xl font-bold uppercase">
              Próximos na pista
            </h2>
            <span className="text-xs text-muted-foreground">Nesta volta</span>
          </div>
          <ol className="divide-y divide-border">
            {next.slice(0, 4).map((entry, index) => (
              <li
                key={`${entry.registrationId}/${entry.id}`}
                className="flex items-center gap-4 px-5 py-4"
              >
                <span className="font-mono text-2xl font-medium text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-xl font-semibold">
                    {entry.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Inscrição #{entry.registrationNumber} ·{" "}
                    {entry.positiveShots}/{entry.totalShots}
                  </p>
                </div>
                <Bonus value={entry.bonus} />
              </li>
            ))}
          </ol>
          {next.length === 0 && (
            <p className="p-6 text-muted-foreground">
              Nenhum outro competidor pendente nesta volta.
            </p>
          )}
          {next.length > 4 && (
            <p className="px-5 pb-4 text-sm text-muted-foreground">
              Mais {next.length - 4} competidores na sequência
            </p>
          )}
        </Card>
      </div>
      <section
        className="grid items-start gap-5 xl:grid-cols-2"
        aria-label="Parciais por fase"
      >
        <Standings
          duel={competition.category.categoryType === "duel"}
          title="Parciais da classificação"
          groups={data.standings.filter(
            (group) => group.phase === "qualification",
          )}
          tick={tick}
        />
        <Standings
          duel={competition.category.categoryType === "duel"}
          title="Parciais da final"
          groups={data.standings.filter((group) => group.phase === "final")}
          tick={tick}
        />
      </section>
      <footer className="mt-5 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
        <span>
          <span className="text-primary">X positiva</span> ·{" "}
          <span className="text-negative">O negativa</span> · Últimas 10 armadas
          · Parciais não definem desempates
        </span>
        <span>
          Atualizado às {new Date(data.generatedAt).toLocaleTimeString("pt-BR")}{" "}
          · Listas alternam a cada 12 s
        </span>
      </footer>
    </main>
  );
}
