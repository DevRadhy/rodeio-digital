import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Scoreboard } from "@/features/scoreboard/types";
import { api } from "@/providers/api";
import type { Competition } from "../types/competition";

export function CompetitionManagement({
  competition,
}: {
  competition: Competition;
}) {
  const [qualification, setQualification] = useState(false);
  const [action, setAction] = useState<"finish-shared" | null>(null);
  const client = useQueryClient();
  const history = useQuery({
    queryKey: ["scoreboard", competition.id],
    queryFn: async ({ signal }) =>
      (
        await api.get<Scoreboard>(`/competition/${competition.id}/scoreboard`, {
          signal,
        })
      ).data,
    enabled: qualification,
    staleTime: 0,
  });
  const mutation = useMutation({
    mutationFn: async (selected: "finish-shared") => {
      await api.post(`/competition/${competition.id}/${selected}`);
    },
    onSuccess: () => {
      toast.success("Modalidade encerrada por divisão do prêmio.");
      setAction(null);
      for (const key of [
        "competition",
        "groups",
        "competition-group",
        "competition-round",
        "group-registrations",
        "scoreboard",
      ])
        void client.invalidateQueries({ queryKey: [key, competition.id] });
      void client.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const finalRunning =
    competition.phase === "final" && competition.status === "running";
  return (
    <>
      <Button variant="outline" onClick={() => setQualification(true)}>
        Ver classificatória
      </Button>
      {finalRunning && (
        <>
          <Button
            variant="destructive"
            onClick={() => {
              mutation.reset();
              setAction("finish-shared");
            }}
          >
            Encerrar modalidade
          </Button>
        </>
      )}
      <Dialog open={qualification} onOpenChange={setQualification}>
        <DialogContent className="sm:max-w-4xl max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Classificatória · {competition.category.name}
            </DialogTitle>
            <DialogDescription>
              Resultados por pelotão. Parciais em positivas / armadas jogadas; X
              positiva e O negativa. Histórico limitado às últimas 10 armadas.
            </DialogDescription>
          </DialogHeader>
          {history.isPending && <p>Carregando classificatória...</p>}
          {history.isError && (
            <p role="alert">
              Não foi possível carregar os resultados.{" "}
              <Button variant="link" onClick={() => history.refetch()}>
                Tentar novamente
              </Button>
            </p>
          )}
          {history.data?.standings
            .filter((group) => group.phase === "qualification")
            .map((group) => (
              <section key={group.id} className="space-y-3">
                <h3 className="font-semibold">
                  {group.name} · {group.activeRegistrationCount} inscrições
                  ativas
                </h3>
                {group.registrations.map((registration) => (
                  <div key={registration.id} className="rounded-xl border p-3">
                    <div className="mb-2 flex flex-wrap justify-between gap-2 font-semibold">
                      <span>
                        Inscrição #{registration.number} ·{" "}
                        {registration.status === "active"
                          ? "Ativa"
                          : "Eliminada"}
                      </span>
                      <span>
                        {registration.positiveShots}/{registration.totalShots}
                      </span>
                    </div>
                    {registration.competitors.map((competitor) => (
                      <div
                        key={competitor.id}
                        className="flex flex-wrap items-center justify-between gap-2 py-1"
                      >
                        <span>
                          {competitor.name} · {competitor.positiveShots}/
                          {competitor.totalShots}
                        </span>
                        <div
                          className="flex gap-1.5"
                          aria-label={`Últimos resultados de ${competitor.name}`}
                        >
                          {competitor.recentResults.map((result) => (
                            <span
                              key={result.id}
                              className={
                                result.shot === "positive"
                                  ? "font-bold text-primary"
                                  : "font-bold text-negative"
                              }
                              title={`Volta ${result.roundNumber}: ${result.shot === "positive" ? "positiva" : "negativa"}`}
                            >
                              {result.shot === "positive" ? "X" : "O"}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                {group.registrations.length === 0 && (
                  <p>Sem inscrições neste pelotão.</p>
                )}
              </section>
            ))}
          {history.data &&
            !history.data.standings.some(
              (group) => group.phase === "qualification",
            ) && <p>Esta competição ainda não tem classificatória.</p>}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={action !== null}
        onOpenChange={(open) => {
          if (!open && !mutation.isPending) setAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Encerrar modalidade por divisão do prêmio?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Todos os grupos e voltas da final serão encerrados, mesmo com
              armadas pendentes. Os resultados e as inscrições ativas serão
              preservados, e novos lançamentos ficarão bloqueados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {mutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {isAxiosError(mutation.error)
                ? (mutation.error.response?.data?.message ??
                  "Não foi possível concluir a ação.")
                : "Não foi possível concluir a ação."}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={mutation.isPending}
              onClick={() => action && mutation.mutate(action)}
            >
              {mutation.isPending ? "Salvando..." : "Confirmar encerramento"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
