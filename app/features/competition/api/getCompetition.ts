import { api } from "@/providers/api";
import type { Competition } from "../types/competition";

export const getCompetition = async (
  competitionId: string,
): Promise<Competition | undefined> => {
  try {
    const { data } = await api.get(`/competition/${competitionId}`);

    return data;
  } catch (error) {
    console.error(error);
  }
};
