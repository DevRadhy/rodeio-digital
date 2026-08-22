import { api } from "@/providers/api";

export const setNextRound = async ({
  competitionId,
  groupId,
  roundId,
}: {
  competitionId: string;
  groupId: string;
  roundId: string;
}): Promise<void> => {
  const { data } = await api.post(
    `/competition/${competitionId}/rounds/${roundId}/finish`,
    {
      groupId,
    },
  );

  return data;
};
