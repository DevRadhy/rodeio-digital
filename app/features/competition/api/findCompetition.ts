import { api } from "@/providers/api";
import type { CompetitionState } from "../types/competition";

export const findCompetition = async (
  competitionId: string,
): Promise<CompetitionState | undefined> => {
  try {
    const { data } = await api.get(`/competition/${competitionId}`);

    return data;
  } catch (error) {
    console.error(error);
  }
};
