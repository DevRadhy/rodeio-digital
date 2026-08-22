import { api } from "@/providers/api";
import type { RoundResults } from "../types/competition";

export const getRoundGroupResults = async (
  competitionId: string,
  roundId: string,
): Promise<RoundResults> => {
  const { data } = await api.get(
    `/competition/${competitionId}/rounds/${roundId}/results`,
  );

  return data;
};
