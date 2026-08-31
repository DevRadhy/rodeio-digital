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
    onSuccess: (_, variables) => {
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
    onSuccess: (_, variables) => {
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
          disabled={group.status === "finished"}
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
          disabled={group.currentRound.status === "finished"}
        >
          Próxima volta <ChevronRight />
        </Button>
      )}
      {competition.phase === "qualification" && group.status === "finished" && (
        <Button
          variant={"default"}
          onClick={onfinishQualificaiton}
          className={"w-full"}
          size={"icon-lg"}
        >
          Iniciar Finais
        </Button>
      )}
    </div>
  );
}
