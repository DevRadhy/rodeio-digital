import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/providers/api";

export function useScoreboardFocus(competitionId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (focus: {
      groupId: string;
      roundId?: string;
      registrationId?: string;
      competitorId?: string;
    }) => {
      await api.post(`/competition/${competitionId}/scoreboard/focus`, focus);
    },
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: ["scoreboard", competitionId],
      });
      toast.success("Placar atualizado.");
    },
    onError: () =>
      toast.error(
        "Não foi possível atualizar o placar. Confira se o competidor ainda está pendente nesta volta.",
      ),
  });
}
