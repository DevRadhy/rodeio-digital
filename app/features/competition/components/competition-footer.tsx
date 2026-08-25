import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setNextRound } from "../api/setNextRound";
import type { Competition, Group, RoundResults } from "../types/competition";

interface CompetitionFooterProps {
  group: Group;
  competition: Competition;
  results: RoundResults;
}

export function CompetitionFooter({
  group,
  competition,
  results,
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

  const onNextRound = () => {
    setRound.mutate({
      competitionId: group.competitionId,
      groupId: group.id,
      roundId: group.currentRound,
    });
  };

  return (
    <div className="flex w-full">
      {results.round.number === competition.category.qualification.rounds &&
      competition.phase === "qualification" ? (
        <Button
          variant={"default"}
          onClick={onNextRound}
          className={"w-full"}
          size={"icon-lg"}
        >
          Finalizar Pelotão
        </Button>
      ) : (
        <Button
          variant={"default"}
          onClick={onNextRound}
          className={"w-full"}
          size={"icon-lg"}
        >
          Próxima volta <ChevronRight />
        </Button>
      )}
    </div>
  );
}
