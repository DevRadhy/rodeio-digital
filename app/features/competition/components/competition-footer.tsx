import { toast } from "sonner";
import { groupKeys } from "../api/group-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { finishQualificaiton } from "../api/finishQualification";
import { setNextRound } from "../api/setNextRound";
import type { Competition, Group } from "../types/competition";

interface CompetitionFooterProps {
  group: Group;
  competition: Competition;
}

export function CompetitionFooter({
  group,
  competition,
}: CompetitionFooterProps) {
  const queryClient = useQueryClient();

  const setRound = useMutation({
    mutationFn: setNextRound,
    onError: () =>
      toast.error(
        "Não foi possível finalizar a volta. Confira se todos foram julgados.",
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
          variables.groupId,
          variables.roundId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "group-registrations",
          variables.competitionId,
          variables.groupId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups", variables.competitionId],
      });
    },
  });

  const finishQualificaiotn = useMutation({
    mutationFn: finishQualificaiton,
    onError: () =>
      toast.error(
        "Não foi possível iniciar as finais. Todos os pelotões devem estar finalizados e deve haver classificados.",
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

  const onNextRound = () => {
    setRound.mutate({
      competitionId: group.competitionId,
      groupId: group.id,
      roundId: group.currentRound.id,
    });
  };

  const onfinishQualificaiton = () => {
    finishQualificaiotn.mutate({ competitionId: competition.id });
  };

  return (
    <div className="w-full gap-4 flex flex-col">
      {group.currentRound.number ===
        competition.category.qualification.rounds &&
      competition.phase === "qualification" ? (
        <Button
          variant={"default"}
          onClick={onNextRound}
          className={"w-full"}
          size={"icon-lg"}
          disabled={
            setRound.isPending ||
            competition.status === "finished" ||
            group.status === "finished"
          }
        >
          {group.status === "finished"
            ? "Pelotão Finalizado"
            : "Finalizar Pelotão"}
        </Button>
      ) : (
        <Button
          variant={"default"}
          onClick={onNextRound}
          className={"w-full"}
          size={"icon-lg"}
          disabled={
            setRound.isPending ||
            competition.status === "finished" ||
            group.status === "finished" ||
            group.currentRound.status === "finished"
          }
        >
          {group.status === "finished" ? (
            "Final encerrada"
          ) : (
            <>
              Próxima volta <ChevronRight />
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
