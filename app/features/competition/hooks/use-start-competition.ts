import { toast } from "sonner";
import { requestErrorMessage } from "@/lib/form-errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { startCompetition } from "../api/startCompetition";

export function useStartCompetition() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const startMutation = useMutation({
    mutationFn: startCompetition,
    onError: (error) =>
      toast.error(
        requestErrorMessage(
          error,
          "Não foi possível iniciar a competição. Confira se há inscrições e tente novamente.",
        ),
      ),
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
    isPending: startMutation.isPending,
  };
}
