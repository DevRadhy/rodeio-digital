import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Scoreboard } from "@/features/scoreboard/types";
import { api } from "@/providers/api";
import type { Competition, Shot } from "../types/competition";
import { CompetitionHeader } from "./competition-header";
import { ShotButtons } from "./shot-buttons";

interface Review {
  canCorrect: boolean;
  finalStarted: boolean;
  pendingCount: number;
  groups: {
    id: string;
    name: string;
    currentRound: number | null;
    rounds: { id: string; number: number; status: string }[];
    registrations: {
      id: string;
      number: number;
      competitors: { id: string; name: string }[];
    }[];
  }[];
  results: {
    roundId: string;
    registrationId: string;
    competitorId: string;
    shot: Shot;
  }[];
}
export function QualificationReview({
  competition,
}: {
  competition: Competition;
}) {
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [number, setNumber] = useState(1);
  const client = useQueryClient();
  const review = useQuery({
    queryKey: ["qualification-review", competition.id],
    queryFn: async ({ signal }) =>
      (
        await api.get<Review>(
          `/competition/${competition.id}/qualification-review`,
          { signal },
        )
      ).data,
    enabled: open || competition.phase === "final",
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
  const conference =
    competition.phase === "final" && review.data && !review.data.finalStarted;
  const scoreboard = useQuery({
    queryKey: ["scoreboard", competition.id],
    queryFn: async ({ signal }) =>
      (
        await api.get<Scoreboard>(`/competition/${competition.id}/scoreboard`, {
          signal,
        })
      ).data,
    enabled: Boolean(conference),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
  const mutation = useMutation({
    mutationFn: async (data: {
      groupId: string;
      roundId: string;
      registrationId: string;
      competitorId: string;
      shot: Shot;
    }) => api.post(`/competition/${competition.id}/shot`, data),
    onSuccess: async () => {
      await Promise.all(
        [
          "qualification-review",
          "scoreboard",
          "competition",
          "groups",
          "competition-group",
          "competition-round",
        ].map((key) =>
          client.invalidateQueries({ queryKey: [key, competition.id] }),
        ),
      );
      toast.success("Resultado corrigido. Classificação atualizada.");
    },
    onError: (error) =>
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ??
              "Não foi possível corrigir o resultado.")
          : "Não foi possível corrigir o resultado.",
      ),
  });
  const group =
    review.data?.groups.find((g) => g.id === groupId) ?? review.data?.groups[0];
  const rounds =
    group?.rounds.filter(
      (r) =>
        competition.phase === "final" || r.number <= (group.currentRound ?? 1),
    ) ?? [];
  const round = rounds.find((r) => r.number === number) ?? rounds[0];
  return (
    <section className="space-y-4" aria-label="Conferência da classificatória">
      {review.isError && (
        <p role="alert">
          Não foi possível carregar a conferência.{" "}
          <Button variant="link" onClick={() => review.refetch()}>
            Tentar novamente
          </Button>
        </p>
      )}
      {conference && (
        <Card>
          <CardHeader>
            <CardTitle>
              Classificados para as finais · Conferência do narrador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Anuncie os classificados de cada força e aguarde as contestações.
              Corrija a classificatória antes de iniciar a primeira final; após
              o início, as correções ficam bloqueadas.
            </p>
            {review.data.pendingCount > 0 && (
              <p role="status" className="font-medium text-rope-ink">
                Há {review.data.pendingCount} armadas pendentes na
                classificatória. Complete os resultados antes de iniciar as
                finais.
              </p>
            )}
            {scoreboard.isPending && <p>Carregando classificados...</p>}
            {scoreboard.isError && (
              <p role="alert">
                Não foi possível carregar os classificados.{" "}
                <Button variant="link" onClick={() => scoreboard.refetch()}>
                  Tentar novamente
                </Button>
              </p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {scoreboard.data?.standings
                .filter((g) => g.phase === "final")
                .map((g) => (
                  <section key={g.id} className="rounded-xl border p-4">
                    <h3 className="mb-3 font-semibold">
                      {g.name} · {g.registrations.length} classificados
                    </h3>
                    {g.registrations.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum competidor classificou nesta força.
                      </p>
                    ) : (
                      <ol className="space-y-2">
                        {g.registrations.map((r) => (
                          <li key={r.id}>
                            <span className="font-semibold">#{r.number}</span> ·{" "}
                            {r.competitors.map((c) => c.name).join(" / ")}
                          </li>
                        ))}
                      </ol>
                    )}
                  </section>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      {review.data?.canCorrect && (
        <Button variant="outline" onClick={() => setOpen(true)}>
          Revisar / corrigir classificatória
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Revisão da classificatória</DialogTitle>
            <DialogDescription>
              Selecione o pelotão e a volta para corrigir uma marcação. Os
              classificados por força são recalculados automaticamente antes do
              início das finais.
            </DialogDescription>
          </DialogHeader>
          {!review.data?.canCorrect && (
            <p role="status">
              A primeira final já iniciou. A classificatória está bloqueada para
              correções.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {review.data?.groups.map((g) => (
              <Button
                key={g.id}
                variant={g.id === group?.id ? "secondary" : "outline"}
                onClick={() => {
                  setGroupId(g.id);
                  setNumber(1);
                }}
              >
                {g.name}
              </Button>
            ))}
          </div>
          {group && round && (
            <>
              <CompetitionHeader
                selectedRound={round.number}
                availableRounds={rounds.length}
                totalRounds={competition.category.qualification.rounds}
                groupLabel={group.name}
                pending={group.registrations.reduce(
                  (count, registration) =>
                    count +
                    registration.competitors.filter(
                      (competitor) =>
                        !review.data?.results.some(
                          (result) =>
                            result.roundId === round.id &&
                            result.registrationId === registration.id &&
                            result.competitorId === competitor.id,
                        ),
                    ).length,
                  0,
                )}
                finished={round.status === "finished"}
                onSelectRound={setNumber}
              />
              {group.registrations.map((registration) => {
                const previous = group.rounds.filter(
                  (r) => r.number < round.number,
                );
                const eligible = previous.every(
                  (r) =>
                    registration.competitors.every((c) =>
                      review.data?.results.some(
                        (result) =>
                          result.roundId === r.id &&
                          result.registrationId === registration.id &&
                          result.competitorId === c.id,
                      ),
                    ) &&
                    (competition.category.categoryType !== "elimination" ||
                      !review.data?.results.some(
                        (result) =>
                          result.roundId === r.id &&
                          result.registrationId === registration.id &&
                          result.shot === "negative",
                      )),
                );
                return (
                  <Card key={registration.id} size="sm">
                    <CardHeader>
                      <CardTitle>Inscrição #{registration.number}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {registration.competitors.map((competitor) => {
                        const result = review.data?.results.find(
                          (r) =>
                            r.roundId === round.id &&
                            r.registrationId === registration.id &&
                            r.competitorId === competitor.id,
                        );
                        return (
                          <div
                            key={competitor.id}
                            className="flex flex-wrap items-center justify-between gap-3"
                          >
                            <span>
                              {competitor.name}
                              {!result && (
                                <span className="block text-xs text-muted-foreground">
                                  {eligible
                                    ? "Sem resultado nesta volta"
                                    : "Sem participação: confira as voltas anteriores"}
                                </span>
                              )}
                            </span>
                            <ShotButtons
                              value={result?.shot ?? null}
                              disabled={
                                !review.data?.canCorrect ||
                                mutation.isPending ||
                                (!result &&
                                  (competition.phase !== "final" || !eligible))
                              }
                              setShot={(shot) =>
                                mutation.mutate({
                                  groupId: group.id,
                                  roundId: round.id,
                                  registrationId: registration.id,
                                  competitorId: competitor.id,
                                  shot,
                                })
                              }
                            />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
