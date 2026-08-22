import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setNextRound } from "../api/setNextRound";
import type { Group } from "../types/competition";

interface CompetitionFooterProps {
  group: Group;
}

export function CompetitionFooter({ group }: CompetitionFooterProps) {
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
          variables.roundId,
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
      <Button
        variant={"default"}
        onClick={onNextRound}
        className={"w-full"}
        size={"icon-lg"}
      >
        {`Próxima volta`} <ChevronRight />
      </Button>
    </div>
  );
}
