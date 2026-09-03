import { useCallback, useEffect, useRef } from "react";
import {
  judgingActionFromKey,
  isJudgingShortcutBlocked,
} from "../lib/judging-shortcuts";
import { toast } from "sonner";
import { groupKeys } from "../api/group-queries";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { finishQualificaiton } from "../api/finishQualification";
import { setNextRound } from "../api/setNextRound";
import type { Competition, Group } from "../types/competition";

interface CompetitionFooterProps {
  group: Group;
  competition: Competition;
  shortcutsEnabled: boolean;
  hasPendingCompetitors: boolean;
}

export function CompetitionFooter({
  group,
  competition,
  shortcutsEnabled,
  hasPendingCompetitors,
}: CompetitionFooterProps) {
  const queryClient = useQueryClient();
  const container = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const completedRound = useRef<string | null>(null);
  const savingShot =
    useIsMutating({ mutationKey: ["judging-shot", competition.id] }) > 0;

  const setRound = useMutation({
    mutationKey: ["competition-advance", competition.id],
    mutationFn: setNextRound,
    onError: () =>
      toast.error(
        "Não foi possível finalizar a volta. Confira se todos foram julgados.",
      ),
    onSuccess: async (_, variables) => {
      completedRound.current = variables.roundId;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        ...[
          "competition",
          "groups",
          "competition-group",
          "competition-round",
          "round-group-results",
          "group-registrations",
          "qualification-review",
          "scoreboard",
        ].map((key) =>
          queryClient.invalidateQueries({
            queryKey: [key, variables.competitionId],
          }),
        ),
      ]);
    },
  });

  const finishQualificaiotn = useMutation({
    mutationFn: finishQualificaiton,
    onError: () =>
      toast.error(
        "Não foi possível iniciar as finais. Todos os pelotões devem estar finalizados. Confira a configuração das finais.",
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({
        queryKey: ["competition", variables.competitionId],
      });
      queryClient.invalidateQueries({
        queryKey: groupKeys.group(variables.competitionId, group.id),
      });
      queryClient.invalidateQueries({
        queryKey: groupKeys.rounds(variables.competitionId, group.id),
      });
      queryClient.invalidateQueries({
        queryKey: [
          "round-group-results",
          variables.competitionId,
          group.id,
          group.currentRound.id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-registrations", variables.competitionId, group.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups", variables.competitionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["competition", variables.competitionId],
      });
    },
  });

  const canAdvance =
    competition.status === "running" &&
    group.status !== "finished" &&
    group.currentRound.status === "running" &&
    !hasPendingCompetitors &&
    !savingShot &&
    !setRound.isPending;
  const onNextRound = useCallback(() => {
    if (
      !canAdvance ||
      busy.current ||
      completedRound.current === group.currentRound.id ||
      queryClient.isMutating({ mutationKey: ["judging-shot", competition.id] })
    )
      return;
    busy.current = true;
    void setRound
      .mutateAsync({
        competitionId: group.competitionId,
        groupId: group.id,
        roundId: group.currentRound.id,
      })
      .catch(() => {})
      .finally(() => {
        busy.current = false;
      });
  }, [
    canAdvance,
    group.competitionId,
    group.id,
    group.currentRound.id,
    competition.id,
    queryClient,
    setRound.mutateAsync,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        !shortcutsEnabled ||
        !canAdvance ||
        judgingActionFromKey(event) !== "advance" ||
        !container.current?.getClientRects().length ||
        isJudgingShortcutBlocked(event)
      )
        return;
      event.preventDefault();
      onNextRound();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcutsEnabled, canAdvance, onNextRound]);

  const onfinishQualificaiton = () => {
    finishQualificaiotn.mutate({ competitionId: competition.id });
  };

  return (
    <div ref={container} className="w-full gap-4 flex flex-col">
      {group.currentRound.number ===
        competition.category.qualification.rounds &&
      competition.phase === "qualification" ? (
        <Button
          variant={"default"}
          onClick={onNextRound}
          className={"w-full"}
          size={"icon-lg"}
          disabled={!canAdvance}
          aria-keyshortcuts={shortcutsEnabled ? "c" : undefined}
        >
          {group.status === "finished"
            ? "Pelotão Finalizado"
            : "Finalizar Pelotão · C"}
        </Button>
      ) : (
        <Button
          variant={"default"}
          onClick={onNextRound}
          className={"w-full"}
          size={"icon-lg"}
          disabled={!canAdvance}
          aria-keyshortcuts={shortcutsEnabled ? "c" : undefined}
        >
          {group.status === "finished" ? (
            "Final encerrada"
          ) : (
            <>
              Próxima volta{" "}
              <kbd className="font-mono text-xs opacity-80">C</kbd>{" "}
              <ChevronRight />
            </>
          )}
        </Button>
      )}
      {competition.phase === "qualification" && group.status === "finished" && (
        <Button
          variant={"default"}
          onClick={onfinishQualificaiton}
          disabled={finishQualificaiotn.isPending}
          className={"w-full"}
          size={"icon-lg"}
        >
          Iniciar Finais
        </Button>
      )}
    </div>
  );
}
