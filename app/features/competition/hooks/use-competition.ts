import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { startCompetition } from "../api/startCompetition";

export function useCompetition() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const startMutation = useMutation({
    mutationFn: startCompetition,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      navigate(`/competition/${data?.competitionId}`);
    },
  });

  const createCompetition = (categoryId: string) => {
    startMutation.mutate(categoryId);
  };

  return {
    createCompetition,
  };
}
