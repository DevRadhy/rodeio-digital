import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startCompetition } from "../api/startCompetition";

export function useCompetition() {
  const queryClient = useQueryClient();

  const startMutation = useMutation({
    mutationFn: startCompetition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const createCompetition = (categoryId: string) => {
    startMutation.mutate(categoryId);
  };

  return {
    createCompetition,
  };
}
